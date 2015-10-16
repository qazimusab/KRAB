/**
 * Created by Fabrice on 10/16/15.
 */
var locationSuccessDialog = document.getElementById("successDialogWindow")
var locationErrorDialog = document.getElementById("errorDialogWindow")
var locationErrorDialogContent = document.getElementById("errorDialogContent")
var zipCodeTextBox = document.getElementById("errorDialogZipCode")
var manualZip = document.getElementById("manualZipContainer")
var manualZipInput = document.getElementById("manualZipInput")

var latitude;
var longitude;
var zipCode;

function init() {
    manualZip.style.display = 'none';
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
    } else {
        locationErrorDialog.show();
    }
}

function onLocationSuccess(position) {
    successDialogContent.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    locationSuccessDialog.show();
}

function onLocationError(error) {

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
}

function dismissErrorDialog() {
    addManualLocationInput();
    locationErrorDialog.close();
    manualZip.style.display = 'block';
    manualZipInput.innerHTML = zipCode;
}

function addManualLocationInput() {
    zipCode = zipCodeTextBox.value
}

init();