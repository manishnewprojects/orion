
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
    zoom: 15,
    mapTypeId: 'roadmap',
    //mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU}
    zoomControl: true,
    mapTypeControl: false,
    fullscreenControl: false,
    scaleControl: false
    });

    var image = 'images/person_icon.png';


    var myMarker = new google.maps.Marker({
        map: map,
        icon: image,
        animation: google.maps.Animation.DROP,
        position:{lat: position.coords.latitude, lng: position.coords.longitude}
    });

    addYourLocationButton(map, myMarker);

    var showLLControlDiv = document.createElement('div');
    var centerControl = new ShowLLControl(showLLControlDiv, map);

    showLLControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(showLLControlDiv);

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
     
     bounds.extend(center);
     map.fitBounds(bounds);
     //map.setCenter(center);

     
   }); 
 }

 function createMarker(latlng, name, address) {
    var f_name = name.replace(/\s+/g, '-');
    var html = "<b>" + name + "</b> <br/>" + address + "</b> <br/>" + "<a target=\"_self\" href=\"sdps/place_details_page.php?place="+f_name+"\">See details \& get a Lantern Guide</a>";
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


//MY LOCATION MARKER CODE BEGINS

function addYourLocationButton(map, marker) 
{
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '28px';
    firstChild.style.height = '28px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '5px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundSize = '180px 18px';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function() {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function() {
        var imgX = '0';
        var animationInterval = setInterval(function(){
            if(imgX == '-18') imgX = '0';
            else imgX = '-18';
            $('#you_location_img').css('background-position', imgX+'px 0px');
        }, 500);
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                marker.setPosition(latlng);
                map.setCenter(latlng);
                clearInterval(animationInterval);
                $('#you_location_img').css('background-position', '-144px 0px');
            });
        }
        else{
            clearInterval(animationInterval);
            $('#you_location_img').css('background-position', '0px 0px');
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}


//MY LOCATION MARKER CODE ENDS


//*START* Center bar to show LanternLocations 

function ShowLLControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        //controlUI.style.backgroundImage = "url(images/lg-logo.png)";
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Show Lantern Locations';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        //controlText.innerHTML = 'Click for LG MustSee Locations';
        controlText.innerHTML = '<img src="images/locations.png" alt="click">';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
         controlUI.addEventListener('click', function() {

           navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
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
      });
}
//*END* Center bar to show LanternLocations


 function doNothing() {}

 function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}




