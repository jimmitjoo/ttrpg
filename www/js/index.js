// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
    navigator.geolocation.getCurrentPosition(onPositionSuccess, onPositionError);
}

// onSuccess Geolocation
//
function onPositionSuccess(position) {
    /*
    var element = document.getElementById('geolocation');
    element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
    'Longitude: '          + position.coords.longitude             + '<br />' +
    'Altitude: '           + position.coords.altitude              + '<br />' +
    'Accuracy: '           + position.coords.accuracy              + '<br />' +
    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
    'Heading: '            + position.coords.heading               + '<br />' +
    'Speed: '              + position.coords.speed                 + '<br />' +
    'Timestamp: '          + position.timestamp                    + '<br />';
    */

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
        //var map = showMap(lat, lng);
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