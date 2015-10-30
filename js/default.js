/**
 * Created by Fabrice on 10/16/15.
 */
var locationSuccessDialog = document.getElementById("successDialogWindow");
var locationErrorDialog = document.getElementById("errorDialogWindow");
var locationErrorDialogContent = document.getElementById("errorDialogContent");
var zipCodeTextBox = document.getElementById("errorDialogZipCode");
var manualZip = document.getElementById("manualZipContainer");
var container = document.getElementById("container");
var jumbotron = document.getElementById("jumbotron");
var listView = document.getElementById("listViewContainer");
var manualZipInput = document.getElementById("manualZipInput");
var spinner;
var opts = {
    lines: 13 // The number of lines to draw
    , length: 30 // The length of each line
    , width: 13 // The line thickness
    , radius: 40 // The radius of the inner circle
    , scale: 1 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.3 // Opacity of the lines
    , rotate: 59 // The rotation offset
    , direction: 1 // 1: clockwise, -1: counterclockwise
    , speed: 1.2 // Rounds per second
    , trail: 25 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: false // Whether to render a shadow
    , hwaccel: false // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
};
var mapCanvas = document.getElementById('map');

var SEARCH_RANGE = 10;

var latitude;
var longitude;
var zipCode;

var map;
var geoCoder;

function init() {
    manualZip.style.display = 'none';
    listView.style.display = 'none';
    mapCanvas.style.display = 'none';
}

function initializeMap() {
    geoCoder = new google.maps.Geocoder();

    var mapOptions = {
        center: {lat: 33.7550, lng: -84.39},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(mapCanvas, mapOptions);
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    } else {
        locationErrorDialog.show();
    }
}

function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    var distanceInMiles = d * 0.621371;
    return distanceInMiles;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

function onLocationSuccess(position) {
    successDialogContent.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    locationSuccessDialog.show();

}

function onLocationError(error) {
    manualZip.style.display = 'block';

    switch(error.code) {
        case error.PERMISSION_DENIED:
            locationErrorDialogContent.innerHTML = "The location permission request was denied";
            locationErrorDialog.show();
            break;
        case error.POSITION_UNAVAILABLE:
            locationErrorDialogContent.innerHTML = "Location information is unavailable";
            locationErrorDialog.show();
            break;
        case error.TIMEOUT:
            locationErrorDialogContent.innerHTML = "The request to get your location timed out";
            locationErrorDialog.show();
            break;
        case error.UNKNOWN_ERR:
            locationErrorDialogContent.innerHTML = "An unknown error occured";
            locationErrorDialog.show();
            break;
    }

}

function dismissSuccessDialog() {
    locationSuccessDialog.close();
    jumbotron.style.display = 'none';
    spinner = new Spinner(opts).spin(container);
    listView.style.display = 'initial';
    mapCanvas.style.display = 'block';

    google.maps.event.addDomListener(window, 'load', initializeMap());

    map.setCenter(new google.maps.LatLng(latitude, longitude))
    $.getJSON("js/sites.json", function(json) {
        var unsortedSitesList = [];
        var sheet1 = json["Sheet1"]
        for(var i = 0; i < sheet1.length; i++){
            var site = new Site();
            site.setSiteId(sheet1[i]["SiteId"]);
            site.setName(sheet1[i]["Name"]);
            site.setAddressLine1(sheet1[i]["AddressLine1"]);
            site.setAddressLine2(sheet1[i]["AddressLine2"]);
            site.setCity(sheet1[i]["City"]);
            site.setState(sheet1[i]["State"]);
            site.setPostal(sheet1[i]["Postal"]);
            site.setVoicePhone(sheet1[i]["VoicePhone"]);
            site.setLatitude(sheet1[i]["Latitude"]);
            site.setLongitude(sheet1[i]["Longitude"]);
            var distanceInMiles = getDistanceFromLatLonInMiles(latitude, longitude, site.lat, site.long);
            site.setDistanceFromCurrentLocation(distanceInMiles);
            unsortedSitesList.push(site)
        }
        var sortedSitesList = mergeSort(unsortedSitesList);
        for(var i = 0; i < sortedSitesList.length && sortedSitesList[i].distanceFromCurrentLocation <= SEARCH_RANGE; i++) {
            var currentSite = sortedSitesList[i];
            var distance = currentSite.distanceFromCurrentLocation + "";
            distance = distance.substring(0, distance.indexOf(".") + 2);
            $("#listViewContainer ul").append("<a href=\"https://www.google.com/maps/preview/?q="
                + currentSite.lat + "," + currentSite.long +"\"><li class=\"list-group-item\"> <span class=\"badge\">" +
                distance + "mi</span>" + currentSite.name + "</li></a>");

            var marker = new google.maps.Marker({
                position: {lat: Number(sortedSitesList[i].lat), lng: Number(sortedSitesList[i].long)},
                map: map,
                title: sortedSitesList[i].name
            });
        }
        spinner.stop()
    });

}

function dismissErrorDialog() {
    addManualLocationInput();
    locationErrorDialog.close();
    manualZip.style.display = 'block';
    manualZipInput.innerHTML = zipCode;

    this.setTimeout(new function() {
        jumbotron.style.display = 'none';
        listView.style.display = 'initial';
    }, 5000);
}

function addManualLocationInput() {
    zipCode = zipCodeTextBox.value;

    mapCanvas.style.display = 'block';
    google.maps.event.addDomListener(window, 'load', initializeMap());
    convertZipToLatLon();
}

function convertZipToLatLon() {
    geoCoder.geocode( {'address' : zipCode}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            latitude = results[0].geometry.location.lat();
            longitude = results[0].geometry.location.lng();

            var marker = new google.maps.Marker({
                position: {lat: latitude, lng: longitude},
                map: map,
                title: 'My position'
            });
            map.setCenter(new google.maps.LatLng(latitude, longitude))
        } else {
            alert("Something went wrong: " + status)
        }
    });
}

function addMapPins(results) {
    //map.data.addGeoJson(results);
}

function Site() {

    this.setSiteId = function(siteId){
        this.siteId = siteId
    };

    this.setName = function(name){
        this.name = name
    };

    this.setAddressLine1 = function(addressLine1){
        this.addressLine1 = addressLine1
    };

    this.setAddressLine2 = function(addressLine2){
        this.addressLine2 = addressLine2
    };

    this.setCity = function(city){
        this.city = city
    };

    this.setState = function(state){
        this.state = state
    };

    this.setPostal = function(postal){
        this.postal = postal
    };

    this.setVoicePhone = function(voicePhone){
        this.voicePhone = voicePhone
    };

    this.setLatitude = function(lat){
        this.lat = lat
    };

    this.setLongitude = function(long){
        this.long = long
    };

    this.setDistanceFromCurrentLocation = function(distanceFromCurrentLocation){
        this.distanceFromCurrentLocation = distanceFromCurrentLocation;
    };
}


function merge(left, right){
    var result  = [],
        il      = 0,
        ir      = 0;

    while (il < left.length && ir < right.length){
        if (left[il].distanceFromCurrentLocation < right[ir].distanceFromCurrentLocation){
            result.push(left[il++]);
        } else {
            result.push(right[ir++]);
        }
    }

    return result.concat(left.slice(il)).concat(right.slice(ir));
}

function mergeSort(items){

    if (items.length < 2) {
        return items;
    }

    var middle = Math.floor(items.length / 2),
        left    = items.slice(0, middle),
        right   = items.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}

init();