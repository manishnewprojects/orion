
var map_places;
var service_places;
var infowindow_places;

function initMap_places(place) {

console.log(place);

  map_places = new google.maps.Map(document.getElementById('map_places'), {
    center: {lat: 37.443033, lng: -122.154619},
    zoom: 15
  });
 

  var request = {
    query: place,
    fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry'],
  };

  service = new google.maps.places.PlacesService(map_places);
  service.findPlaceFromQuery(request, callback);
}



function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
     }
     console.log(place.formatted_address);
          console.log(place.opening_hours);
          console.log(place.name);

  }
} 

function GetURLParameter(sParam) {

  var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }

}
