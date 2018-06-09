// Copyright (C) 2018, @mr_dreamerskies

 

// Get location of the user  

function getLocation(){
if (navigator.geolocation) {
          var options = {timeout:50000};
          navigator.geolocation.getCurrentPosition(function(position) {
             pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }; send_values(pos);
            }, errorHandler, options);

            }
            else{
               alert("Sorry, browser does not support geolocation!");
  }
}   

// Function to provide fake lat/long if none are available - resolves to middle of Pacific Ocean  

function errorHandler(err) {
  pos = {
              lat:-122,
              lng:37
            };
  if(err.code == 1) {
      alert("Error: Access is denied!");
      send_values(pos);
  }     
  else if( err.code == 2) {
      alert("Error: Position is unavailable!");
      send_values(pos);
  }
}
 
function send_values(position) {

var loc_details=JSON.stringify(position); //convert functiona param to a string (only way to do it in JS)

var lat=parseFloat(loc_details.substring(loc_details.lastIndexOf("lat:")+8,loc_details.lastIndexOf(","))); //extract lat string, convert to float

var lng=parseFloat(loc_details.substring(loc_details.indexOf("lng")+5,loc_details.lastIndexOf("}"))); //extract lng string, convert to float

var user_loc = {lat, lng};


        map = new google.maps.Map(document.getElementById('map'), {
          center: user_loc,
          zoom: 15
        });

        infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: user_loc,
          radius: 300,
          type: ['store']
        }, callback);



}


 function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
    }


 