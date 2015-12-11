/**
 * Created by Qazi Ahmed on 10/16/15.
 */
var container = document.getElementById("container");
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

var latitude;
var longitude;

$(document).ready(function() {
    spinner = new Spinner(opts).spin(container);
    getLocation();
});

function getLocation() {
    navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);
}

function onLocationSuccess(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    loadMenu();
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

function loadMenu() {
    $('#menu_image1').attr("src", "http://farm6.staticflickr.com/5032/14216615379_9725c7654a_b.jpg");
    $('#menu_image2').attr("src", "http://farm6.staticflickr.com/5032/14216615379_9725c7654a_b.jpg");
    $('#menu_image3').attr("src", "http://farm6.staticflickr.com/5032/14216615379_9725c7654a_b.jpg");
    $('#menu_image4').attr("src", "http://farm6.staticflickr.com/5032/14216615379_9725c7654a_b.jpg");
    $('#menu_image5').attr("src", "http://farm6.staticflickr.com/5032/14216615379_9725c7654a_b.jpg");
    $('#menu_image6').attr("src", "http://farm6.staticflickr.com/5032/14216615379_9725c7654a_b.jpg");
    spinner.stop()
}
