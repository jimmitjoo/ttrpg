// Wait for device API libraries to load
//

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        navigator.geolocation.getCurrentPosition(onSuccess, onError);

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }

};

function onSuccess(position) {
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
    'Longitude: ' + position.coords.longitude     + '<br />';

}

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n');
}


/*

document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    alert('yo');
    navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError);
}

// onSuccess Geolocation
//
function onPositionSuccess(position) {

    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
    'Longitude: '          + position.coords.longitude             + '<br />' +
    'Altitude: '           + position.coords.altitude              + '<br />' +
    'Accuracy: '           + position.coords.accuracy              + '<br />' +
    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
    'Heading: '            + position.coords.heading               + '<br />' +
    'Speed: '              + position.coords.speed                 + '<br />' +
    'Timestamp: '          + position.timestamp                    + '<br />';


    var map = new GoogleMap();
    map.initialize(position.coords.latitude, position.coords.longitude);

}

// onError Callback receives a PositionError object
//
function onPositionError(error) {
    alert('code: '    + error.code    + '\n' +
    'message: ' + error.message + '\n');
}


function GoogleMap(){

    var geocoder;

    this.initialize = function(lat, lng){
        var map = showMap(lat, lng);
        geocoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({'latLng': latlng}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var element = document.getElementById('geolocation');
                    element.innerHTML = '';
                    for (var i=0; i<results.length; i++) {
                        element.innerHTML = element.innerHTML + '<br />' + results[i].formatted_address;
                    }
                }
            }
        });

    }

    var showMap = function(lat, lng){
        var mapOptions = {
            zoom: 20,
            center: new google.maps.LatLng(lat, lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        var map = new google.maps.Map(document.getElementById("geolocation"), mapOptions);

        return map;
    }
}
    */