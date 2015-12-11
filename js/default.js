/**
 * Created by Fabrice on 10/16/15.
 */
var container = document.getElementById("container");
var spinner;
var sites;
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
    sites = new Array();
    var siteAPI = "http://ncrmarketplaceapi.azurewebsites.net/api/sites";

    $.getJSON("js/sites.json",function(json) {
        for (var i=0; i<json.length; i++) {
            var site = new Site();
            site.setName(json[i]["SiteName"]);
            site.setMenuUrl(json[i]["MenuImage"]);
            site.setSiteAddress((json[i]["AddressLine1"]));
            sites.push(site);
        }
        spinner.stop()
    }).done(function() {
        for(var i=0; i<sites.length; i++) {
            $('<div class="item"><img class="center-block" src=" '+ sites[i].menuUrl +'" alt="Flower" width="80%" height="100%"><div class="carousel-caption"> <h3 style="color:red">'+sites[i].name+'</h3> <p style="color:red">'+sites[i].siteAddress+'</p></div></div>').appendTo('.carousel-inner');
            $('<li data-target="#myCarousel" style="background:red" data-slide-to="'+i+'"></li>').appendTo('.carousel-indicators');
        }
        $('.item').first().addClass('active');
        $('.carousel-indicators > li').first().addClass('active');
        $('#myCarousel').carousel();
    }).fail(function() {
        console.log("LoadMenu failed")
    });
}

function Site() {

    this.setName = function(name){
        this.name = name
    };
    this.setMenuUrl = function(menuUrl){
        this.menuUrl = menuUrl
    };
    this.setSiteAddress = function(siteAddress) {
        this.siteAddress = siteAddress
    }

}
