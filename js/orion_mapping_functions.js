
// Copyright (C) 2018, @mr_dreamerskies


var map;
var markers = [];
var infoWindow;
var locationSelect;


function initMap() {

// Try HTML5 geolocation.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    map = new google.maps.Map(document.getElementById('map'), {
    //center: {lat: 37.443033, lng: -122.154619},
    center: {lat: position.coords.latitude, lng: position.coords.longitude},
    zoom: 20,
    mapTypeId: 'roadmap',
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    });
      infoWindow = new google.maps.InfoWindow;

      var loc_details=JSON.stringify(pos); //convert functiona param to a string (MV_ only way to do it in JS)
      var lat=loc_details.substring(loc_details.lastIndexOf("lat:")+8,loc_details.lastIndexOf(",")); //extract lat string, convert to float
      var lng=loc_details.substring(loc_details.indexOf("lng")+5,loc_details.lastIndexOf("}")); //extract lng string, convert to float
      var user_loc = lat+","+lng;
      var geocoder_startup = new google.maps.Geocoder();

      geocoder_startup.geocode({address: user_loc}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {

        searchLocationsNear(results[0].geometry.location);

       }
     });
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  }

  
 function searchLocationsNear(center) {

   radius=10;

   var searchUrl = 'php_includes/showpointsofinterest.php?lat=' + center.lat() + '&lng=' + center.lng() + '&radius=' + radius;

   downloadUrl(searchUrl, function(data) {
     var xml = parseXml(data);
     var markerNodes = xml.documentElement.getElementsByTagName("marker");
     var bounds = new google.maps.LatLngBounds();
     for (var i = 0; i < markerNodes.length; i++) {
       var id = markerNodes[i].getAttribute("id");
       var name = markerNodes[i].getAttribute("name");
       var address = markerNodes[i].getAttribute("address");
       var distance = parseFloat(markerNodes[i].getAttribute("distance"));
       var latlng = new google.maps.LatLng(
            parseFloat(markerNodes[i].getAttribute("lat")),
            parseFloat(markerNodes[i].getAttribute("lng")));

       createMarker(latlng, name, address);
       bounds.extend(latlng);
     }
     map.fitBounds(bounds);
     
   });
 }

 function createMarker(latlng, name, address) {
    var html = "<b>" + name + "</b> <br/>" + address;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
  }


 function downloadUrl(url, callback) {
    var request = window.ActiveXObject ?
        new ActiveXObject('Microsoft.XMLHTTP') :
        new XMLHttpRequest;

    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        request.onreadystatechange = doNothing;
        callback(request.responseText, request.status);
      }
    };

    request.open('GET', url, true);
    request.send(null);
 }

 function parseXml(str) {
    if (window.ActiveXObject) {
      var doc = new ActiveXObject('Microsoft.XMLDOM');
      doc.loadXML(str);
      return doc;
    } else if (window.DOMParser) {
      return (new DOMParser).parseFromString(str, 'text/xml');
    }
 }

 function doNothing() {}

 function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}


