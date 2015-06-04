var ang = angular.module('ttr', ['ionic', 'starter.controllers']);
var apiEndpoint = 'http://timetorun.se/api';

ang.constant("FACEBOOK_APP_ID", "1432852267028834");

ang.run(function($ionicPlatform, $rootScope, $state) {

    $ionicPlatform.on("deviceready", function(){
        facebookConnectPlugin.getLoginStatus(function(success){
            if(success.status === 'connected'){
                $state.go('app.feed');
            }else{
                $state.go('login');
            }
        });

        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    $ionicPlatform.on("resume", function(){
        facebookConnectPlugin.getLoginStatus(function(success){
            if(success.status != 'connected'){
                $state.go('login');
            }
        });
    });

    // UI Router Authentication Check
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        if (toState.data.authenticate) {
            facebookConnectPlugin.getLoginStatus(function(success){
                    if(success.status === 'connected'){

                    }else{
                        event.preventDefault();
                        $state.go('login');
                    }
                },
                function(fail){
                });
        }
    });
});

ang.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('login', {
            url: "/",
            templateUrl: "templates/login.html",
            controller: 'LoginCtrl',
            data: {
                authenticate: false
            }
        })

        .state('app.profile', {
            url: "/profile",
            views: {
                'menuContent': {
                    templateUrl: "templates/profile.html",
                    controller: 'ProfileCtrl'
                }
            },
            data: {
                authenticate: true
            }
        })

        .state('app.likes', {
            url: "/likes",
            views: {
                'menuContent': {
                    templateUrl: "templates/likes.html",
                    controller: 'LikesCtrl'
                }
            },
            data: {
                authenticate: true
            }
        })

        .state('app.photos', {
            url: "/photos",
            views: {
                'menuContent': {
                    templateUrl: "templates/photos.html",
                    controller: 'PhotosCtrl'
                }
            },
            data: {
                authenticate: true
            }
        })

        .state('app.feed', {
            url: "/feed",
            views: {
                'menuContent': {
                    templateUrl: "templates/feed.html",
                    controller: 'FeedCtrl'
                }
            },
            data: {
                authenticate: true
            }
        })

        .state('app.share', {
            url: "/share",
            views: {
                'menuContent': {
                    templateUrl: "templates/share.html",
                    controller: 'ShareCtrl'
                }
            },
            data: {
                authenticate: true
            }
        })

        .state('app.listruns', {
            url: "/list",
            view: {
                'menuContent': {
                    templateUrl: "main.html",
                    controller: "ListRunCtrl"
                }
            },
            date: {
                authenticate: true
            }
        })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});
/*
ang.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'ListRunsController',
            controllerAs: 'list'
        })
        .when('/Run/:id', {
            templateUrl: 'run.html',
            controller: 'RunController',
            controllerAs: 'run'
        })
        .when('/Organizer/:id', {
            templateUrl: 'organizer.html',
            controller: 'OrganizerController',
            controllerAs: 'organizer'
        });

});
*/


ang.service('UserService', function () {

//for the purpose of this example I will store user data on ionic local storage but you should save it on a database
    var setUser = function (user_data) {
        window.localStorage['user'] = JSON.stringify(user_data);
    };

    var getUser = function () {
        return JSON.parse(window.localStorage['user'] || '{}');
    };

    var deleteUser = function () {
        window.localStorage.clear();
    };

    return {
        getUser: getUser,
        setUser: setUser,
        deleteUser: deleteUser
    }
});

/*
ang.factory('Globals', function ($rootScope) {
    var globals = {
        pageTitle: 'TimeToRun'
    };

    $rootScope.$watch(function () {
        return globals.pageTitle;
    }, function (newValue, oldValue, scope) {
        // This is called after the key "key" has changed, a good idea is to broadcast a message that key has changed
        $rootScope.$broadcast('Globals:pageTitleChanged', newValue);
    }, true);

    return globals;
});


ang.controller('MainController', ["$scope", "$route", "$routeParams", "$location", "$rootScope", "Globals", function ($scope, $route, $routeParams, $location, $rootScope, Globals) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $rootScope.$on('Globals:pageTitleChanged', function currentCityChanged(event, value) {
        $scope.pageTitle = value;
    });

}]);


ang.controller('RunController', ["$scope", "$routeParams", "$http", "Globals", function ($scope, $routeParams, $http, Globals) {

    $scope.$routeParams = $routeParams;

    $http.jsonp(apiEndpoint + '/race/' + $scope.$routeParams.id + '?callback=JSON_CALLBACK', {cache: false})
        .success(function (response) {
            $scope.race = response;
            Globals.pageTitle = response.name;
        });

}]);


ang.controller('OrganizerController', ["$scope", "$routeParams", "$http", "Globals", function ($scope, $routeParams, $http, Globals) {

    $scope.$routeParams = $routeParams;

    $http.jsonp(apiEndpoint + '/organizer/' + $scope.$routeParams.id + '?callback=JSON_CALLBACK', {cache: false})
        .success(function (response) {
            $scope.organizer = response;
            Globals.pageTitle = response.name;
        });
}]);


ang.controller('ListRunsController', ["$scope", "$routeParams", "$http", "Globals", function ($scope, $routeParams, $http, Globals) {

    Globals.pageTitle = 'TimeToRun';

    $scope.$routeParams = $routeParams;

    $scope.page = 1;
    $scope.last = null;
    $scope.searchQuery = '';
    $scope.races = [];


    $scope.loadData = function () {

        $('#paginateSpinner').show();

        $http.jsonp(apiEndpoint + '/race/page/' + $scope.searchQuery + '?page=' + $scope.page + '&callback=JSON_CALLBACK', {cache: false})
            .success(function (response) {
                $scope.last = response.last_page;
                if ($scope.page == $scope.last) {
                    $('.show-more').hide();
                } else {
                    $('.show-more').show();
                }

                $scope.races = $scope.races.concat(response.data);
                $('#paginateSpinner').hide();
            }).error(function (data) {
                console.log(data);
            });

    };

    $('.search-field').on('keyup', function () {
        delay(function () {
            $scope.races = [];
            $scope.loadData();
        }, 250);
    });

    $('.search-clear').on('click', function () {
        $('.search-field').val('');
        $scope.searchQuery = '';
        $scope.races = [];
        $scope.loadData();
    });

    $scope.showMore = function () {
        $scope.page += 1;
        $scope.loadData();
    };

    $scope.loadData();


}]);


ang.controller('AuthController', function ($scope, $state, $q, UserService, $ionicLoading, FACEBOOK_APP_ID) {
    $scope.slideIndex = 0;

    var fbLogged = $q.defer();

    //This is the success callback from the login method
    var fbLoginSuccess = function (response) {
        if (!response.authResponse) {
            fbLoginError("Cannot find the authResponse");
            return;
        }
        var expDate = new Date(
            new Date().getTime() + response.authResponse.expiresIn * 1000
        ).toISOString();

        var authData = {
            id: String(response.authResponse.userID),
            access_token: response.authResponse.accessToken,
            expiration_date: expDate
        }
        fbLogged.resolve(authData);
    };

    //This is the fail callback from the login method
    var fbLoginError = function (error) {
        fbLogged.reject(error);
        alert(error);
        $ionicLoading.hide();
    };

    //this method is to get the user profile info from the facebook api
    var getFacebookProfileInfo = function () {
        var info = $q.defer();
        facebookConnectPlugin.api('/me', "",
            function (response) {
                info.resolve(response);
            },
            function (response) {
                info.reject(response);
            }
        );
        return info.promise;
    }

    //This method is executed when the user press the "Login with facebook" button
    $scope.login = function () {

        if (!window.cordova) {
            //this is for browser only
            facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
        }

        //check if we have user's data stored
        var user = UserService.getUser();

        facebookConnectPlugin.getLoginStatus(function (success) {
            // alert(success.status);
            if (success.status === 'connected') {
                // the user is logged in and has authenticated your app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed request, and the time the access token
                // and signed request each expire
                $state.go('app.feed');

            } else {
                //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
                //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.

                //this is a loader
                $ionicLoading.show({
                    template: 'Loging in...'
                });

                //ask the permissions you need
                //you can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.2
                facebookConnectPlugin.login(['email',
                    'public_profile',
                    'user_about_me',
                    'user_likes',
                    'user_location',
                    'read_stream',
                    'user_photos'], fbLoginSuccess, fbLoginError);

                fbLogged.promise.then(function (authData) {

                    var fb_uid = authData.id,
                        fb_access_token = authData.access_token;

                    //get user info from FB
                    getFacebookProfileInfo().then(function (data) {

                        var user = data;
                        user.picture = "http://graph.facebook.com/" + fb_uid + "/picture?type=large";
                        user.access_token = fb_access_token;

                        //save the user data
                        //for the purpose of this example I will store it on ionic local storage but you should save it on a database
                        UserService.setUser(user);

                        $ionicLoading.hide();
                        $state.go('app.feed');
                    });
                });
            }
        });
    }
});
*/

angular.module('starter.controllers', [])

    .controller('AppCtrl', function($scope, $state, $ionicPopup, UserService, $ionicLoading, FACEBOOK_APP_ID) {
        $scope.user = UserService.getUser();

        // A confirm dialog to be displayed when the user wants to log out
        $scope.showConfirmLogOut = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Log out',
                template: 'Are you sure you want to log out?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    //logout
                    $ionicLoading.show({
                        template: 'Loging out...'
                    });

                    if (!window.cordova) {
                        //this is for browser only
                        facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
                    }

                    facebookConnectPlugin.logout(function(){
                            //success
                            UserService.deleteUser();
                            $ionicLoading.hide();
                            $state.go('login');
                        },
                        function(fail){
                            $ionicLoading.hide();
                        });
                } else {
                    //cancel log out
                }
            });
        };

    })

    .controller('LoginCtrl', function($scope, $state, $q, UserService, $ionicLoading, FACEBOOK_APP_ID) {
        $scope.slideIndex = 0;

        var fbLogged = $q.defer();

//This is the success callback from the login method
        var fbLoginSuccess = function(response) {
            if (!response.authResponse){
                fbLoginError("Cannot find the authResponse");
                return;
            }
            var expDate = new Date(
                new Date().getTime() + response.authResponse.expiresIn * 1000
            ).toISOString();

            var authData = {
                id: String(response.authResponse.userID),
                access_token: response.authResponse.accessToken,
                expiration_date: expDate
            }
            fbLogged.resolve(authData);
        };

        //This is the fail callback from the login method
        var fbLoginError = function(error){
            fbLogged.reject(error);
            alert(error);
            $ionicLoading.hide();
        };

        //this method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function () {
            var info = $q.defer();
            facebookConnectPlugin.api('/me', "",
                function (response) {
                    info.resolve(response);
                },
                function (response) {
                    info.reject(response);
                }
            );
            return info.promise;
        }

//This method is executed when the user press the "Login with facebook" button
        $scope.login = function() {

            if (!window.cordova) {
                //this is for browser only
                facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
            }

            //check if we have user's data stored
            var user = UserService.getUser();

            facebookConnectPlugin.getLoginStatus(function(success){
                // alert(success.status);
                if(success.status === 'connected'){
                    // the user is logged in and has authenticated your app, and response.authResponse supplies
                    // the user's ID, a valid access token, a signed request, and the time the access token
                    // and signed request each expire
                    $state.go('app.feed');

                } else {
                    //if (success.status === 'not_authorized') the user is logged in to Facebook, but has not authenticated your app
                    //else The person is not logged into Facebook, so we're not sure if they are logged into this app or not.

                    //this is a loader
                    $ionicLoading.show({
                        template: 'Logging in...'
                    });

                    //ask the permissions you need
                    //you can learn more about FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.2
                    facebookConnectPlugin.login(['email',
                        'public_profile',
                        'user_about_me',
                        'user_likes',
                        'user_location',
                        'read_stream',
                        'user_photos'], fbLoginSuccess, fbLoginError);

                    fbLogged.promise.then(function(authData) {

                        var fb_uid = authData.id,
                            fb_access_token = authData.access_token;

                        //get user info from FB
                        getFacebookProfileInfo().then(function(data) {

                            var user = data;
                            user.picture = "http://graph.facebook.com/"+fb_uid+"/picture?type=large";
                            user.access_token = fb_access_token;

                            //save the user data
                            //for the purpose of this example I will store it on ionic local storage but you should save it on a database
                            UserService.setUser(user);

                            $ionicLoading.hide();
                            $state.go('app.feed');
                        });
                    });
                }
            });
        }
    })

    .controller('ProfileCtrl', function($scope, $state, UserService) {
        $scope.user = UserService.getUser();
    })

    .controller('LikesCtrl', function($scope, $state, UserService, FACEBOOK_APP_ID, $q, $ionicLoading) {
        $scope.user = UserService.getUser();

        $scope.doRefresh = function() {
            var likes = $q.defer();

            if (!window.cordova) {
                //this is for browser only
                facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
            }

            $ionicLoading.show({
                template: 'Loading likes...'
            });

            facebookConnectPlugin.api('/'+$scope.user.id+'/likes?access_token='+ $scope.user.access_token, null,
                function (response) {
                    likes.resolve(response.data);
                },
                function (response) {
                    likes.reject(response);
                });

            likes.promise.then(function(photos){
                $scope.likes = photos;

                $ionicLoading.hide();
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            },function(fail){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.doRefresh();
    })

    .controller('PhotosCtrl', function($scope, $state, UserService, $q, FACEBOOK_APP_ID, $ionicLoading) {
        $scope.user = UserService.getUser();

        $scope.doRefresh = function() {
            var photos = $q.defer();

            if (!window.cordova) {
                //this is for browser only
                facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
            }

            $ionicLoading.show({
                template: 'Loading photos...'
            });

            facebookConnectPlugin.api('/'+$scope.user.id+'/photos?access_token='+ $scope.user.access_token, null,
                function (response) {
                    photos.resolve(response.data);
                },
                function (response) {
                    photos.reject(response);
                });

            photos.promise.then(function(photos){
                $scope.photos = photos;

                $ionicLoading.hide();
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            },function(fail){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.doRefresh();
    })

    .controller('FeedCtrl', function($scope, $state, UserService, $q, FACEBOOK_APP_ID, $ionicLoading) {
        $scope.user = UserService.getUser();

        $scope.doRefresh = function() {
            var feed = $q.defer();

            if (!window.cordova) {
                //this is for browser only
                facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
            }

            $ionicLoading.show({
                template: 'Loading feed...'
            });

            facebookConnectPlugin.api('/'+$scope.user.id+'/home?access_token='+ $scope.user.access_token, null,
                function (response) {
                    feed.resolve(response.data);
                },
                function (response) {
                    feed.reject(response);
                }
            );

            feed.promise.then(function(feed_response){
                $scope.feed = feed_response;

                $ionicLoading.hide();
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            },function(fail){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        $scope.doRefresh();
    })

    .controller('ShareCtrl', function($scope, $state, UserService, $q, FACEBOOK_APP_ID, $ionicLoading) {
        $scope.user = UserService.getUser();
        $scope.image_to_share = "https://c1.staticflickr.com/9/8322/8057495684_335ee78565_z.jpg";

        if (!window.cordova) {
            //this is for browser only
            facebookConnectPlugin.browserInit(FACEBOOK_APP_ID);
        }

        $scope.post_status = function() {
            facebookConnectPlugin.showDialog(
                {
                    method:"feed"
                },
                function (response) {
                    $ionicLoading.show({ template: 'Status posted!', noBackdrop: true, duration: 2000 });
                },
                function (response) {
                    //fail
                });
        };

        $scope.send_message = function() {
            facebookConnectPlugin.showDialog({
                    method: 'send',
                    link:'http://example.com',
                },
                function (response) {
                    $ionicLoading.show({ template: 'Message sent!', noBackdrop: true, duration: 2000 });
                },
                function (response) {
                    //fail
                });
        };

        $scope.post_image = function() {
            facebookConnectPlugin.showDialog(
                {
                    method: "feed",
                    picture: $scope.image_to_share,
                    name:'Test Post',
                    message:'This is a test post',
                    caption: 'Testing using IonFB app',
                    description: 'Posting photo using IonFB app'
                },
                function (response) {
                    $ionicLoading.show({ template: 'Image posted!', noBackdrop: true, duration: 2000 });
                },
                function (response) {
                    //fail
                });
        };

        $scope.share_link = function() {
            facebookConnectPlugin.showDialog(
                {
                    method: "share",
                    href: 'http://example.com',
                },
                function (response) {
                    $ionicLoading.show({ template: 'Link shared!', noBackdrop: true, duration: 2000 });
                },
                function (response) {
                    //fail
                });
        };
    }).controller('ListRunsCtrl', ["$scope", "$state", "UserService", function ($scope, $state, UserService) {

        $scope.page = 1;
        $scope.last = null;
        $scope.searchQuery = '';
        $scope.races = [];


        $scope.loadData = function () {

            $('#paginateSpinner').show();

            $http.jsonp(apiEndpoint + '/race/page/' + $scope.searchQuery + '?page=' + $scope.page + '&callback=JSON_CALLBACK', {cache: false})
                .success(function (response) {
                    $scope.last = response.last_page;
                    if ($scope.page == $scope.last) {
                        $('.show-more').hide();
                    } else {
                        $('.show-more').show();
                    }

                    $scope.races = $scope.races.concat(response.data);
                    $('#paginateSpinner').hide();
                }).error(function (data) {
                    console.log(data);
                });

        };

        $('.search-field').on('keyup', function () {
            delay(function () {
                $scope.races = [];
                $scope.loadData();
            }, 250);
        });

        $('.search-clear').on('click', function () {
            $('.search-field').val('');
            $scope.searchQuery = '';
            $scope.races = [];
            $scope.loadData();
        });

        $scope.showMore = function () {
            $scope.page += 1;
            $scope.loadData();
        };

        $scope.loadData();


    }]);


/*
 * Denna funktion bör ligga någon annanstans
 */
var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImNvbnRyb2xsZXJzL3J1blBhZ2luYXRpb25Db250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHBsaWNhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgndHRyJywgIFsndWkuYm9vdHN0cmFwJ10pO1xuXG4iLCJhcHAuY29udHJvbGxlcigncnVuUGFnaW5hdGlvbkNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkaHR0cCkge1xuXG4gICAgJHNjb3BlLnBhZ2UgPSAxO1xuICAgICRzY29wZS5sYXN0ID0gbnVsbDtcbiAgICAkc2NvcGUuc2VhcmNoUXVlcnkgPSAnJztcbiAgICAkc2NvcGUucmFjZXMgPSBbXTtcblxuXG4gICAgdmFyIGFwaUVuZHBvaW50ID0gJ2h0dHA6Ly90aW1ldG9ydW4uc2UvcmFjZS9wYWdlJztcblxuXG4gICAgJHNjb3BlLmxvYWREYXRhID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgJCgnI3BhZ2luYXRlU3Bpbm5lcicpLnNob3coKTtcblxuICAgICAgICBpZiAoJCgnI3J1blRvd24nKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkc2NvcGUuc2VhcmNoUXVlcnkgPSAkKCcjcnVuVG93bicpLnZhbCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGh0dHAuanNvbnAoYXBpRW5kcG9pbnQgKyAnLycgKyAkc2NvcGUuc2VhcmNoUXVlcnkgKyAnP3BhZ2U9JyArICRzY29wZS5wYWdlICsgJyZjYWxsYmFjaz1KU09OX0NBTExCQUNLJywgeyBjYWNoZTogZmFsc2V9KVxuICAgICAgICAgICAgLnN1Y2Nlc3MoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgICRzY29wZS5sYXN0ID0gcmVzcG9uc2UubGFzdF9wYWdlO1xuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucGFnZSA9PSAkc2NvcGUubGFzdCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2hvdy1tb3JlJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5zaG93LW1vcmUnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJHNjb3BlLnJhY2VzID0gJHNjb3BlLnJhY2VzLmNvbmNhdChyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICAkKCcjcGFnaW5hdGVTcGlubmVyJykuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJCgnLnNlYXJjaC1maWVsZCcpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIGRlbGF5KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkc2NvcGUucmFjZXMgPSBbXTtcbiAgICAgICAgICAgICRzY29wZS5sb2FkRGF0YSgpO1xuICAgICAgICB9LCAyNTAgKTtcbiAgICB9KTtcblxuICAgICQoJy5zZWFyY2gtY2xlYXInKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuICAgICAgICAkKCcuc2VhcmNoLWZpZWxkJykudmFsKCcnKTtcbiAgICAgICAgJHNjb3BlLnNlYXJjaFF1ZXJ5ID0gJyc7XG4gICAgICAgICRzY29wZS5yYWNlcyA9IFtdO1xuICAgICAgICAkc2NvcGUubG9hZERhdGEoKTtcbiAgICB9KTtcblxuICAgICRzY29wZS5zaG93TW9yZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAkc2NvcGUucGFnZSArPSAxO1xuICAgICAgICAkc2NvcGUubG9hZERhdGEoKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvYWREYXRhKCk7XG5cblxufSk7XG5cblxuLypcbiAqIERlbm5hIGZ1bmt0aW9uIGLDtnIgbGlnZ2EgbsOlZ29uIGFubmFuc3RhbnNcbiAqL1xudmFyIGRlbGF5ID0gKGZ1bmN0aW9uKCl7XG4gICAgdmFyIHRpbWVyID0gMDtcbiAgICByZXR1cm4gZnVuY3Rpb24oY2FsbGJhY2ssIG1zKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0ICh0aW1lcik7XG4gICAgICAgIHRpbWVyID0gc2V0VGltZW91dChjYWxsYmFjaywgbXMpO1xuICAgIH07XG59KSgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==