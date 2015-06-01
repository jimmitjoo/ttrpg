var app = angular.module('ttr', ['ngRoute']);
var apiEndpoint = 'http://timetorun.se/api';

app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'main.html',
            controller: 'ListRunsController'
        })
        .when('/Run/:id', {
            templateUrl: 'run.html',
            controller: 'RunController'
        })
        .when('/Organizer/:id', {
            templateUrl: 'organizer.html',
            controller: 'OrganizerController'
        });

});


app.controller('MainController', ["$scope", "$route", "$routeParams", "$location", function ($scope,  $route, $routeParams, $location) {

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

}]);


app.controller('RunController', ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {

    $scope.$routeParams = $routeParams;

    $http.jsonp(apiEndpoint + '/race/' + $scope.$routeParams.id + '?callback=JSON_CALLBACK', {cache: false})
        .success(function (response) {
            $scope.race = response;
        });
}]);


app.controller('OrganizerController', ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {

    $scope.$routeParams = $routeParams;

    $http.jsonp(apiEndpoint + '/organizer/' + $scope.$routeParams.id + '?callback=JSON_CALLBACK', {cache: false})
        .success(function (response) {
            $scope.organizer = response;
        });
}]);


app.controller('ListRunsController', ["$scope", "$routeParams", "$http", function ($scope, $routeParams, $http) {

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