/**
 * Created by Fabrice on 10/16/15.
 */
var orderingFlowParagraph = document.getElementById("orderingFlow")
var manualZip = document.getElementById("manualZipContainer")

function init() {
    manualZip.style.display = 'none';
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    } else {
        orderingFlowParagraph.innerHTML = "Geolocation is not supported by this browser";
    }
}

function onLocationSuccess(position) {
    orderingFlowParagraph.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

function onLocationError(error) {
    manualZip.style.display = 'block';
    alert("We couldn't retrieve your location");
    orderingFlowParagraph.className += orderingFlowParagraph.className == "has-error" ? "" : "has-error" ;

    switch(error.code) {
        case error.PERMISSION_DENIED:
            orderingFlowParagraph.innerHTML = "The permission request was denied";
            break;
        case error.POSITION_UNAVAILABLE:
            orderingFlowParagraph.innerHTML = "Location information is unavailable";
            break;
        case error.TIMEOUT:
            orderingFlowParagraph.innerHTML = "The request to get your location timed out";
            break;
        case error.UNKNOWN_ERR:
            orderingFlowParagraph.innerHTML = "An unknown error occured";
            break;
    }
}

function addManualLocationInput() {

}

init();