function changePosition(position){
    window.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude)).setZoom(12);
}

function initMap() {
  const rio = new google.maps.LatLng(-22.958296, -43.257151);

    
  window.map = new google.maps.Map(document.getElementById("map"), {
    center: rio,
    zoom: 6
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(changePosition);
  } 

  fetch("./places.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(places){
        for (var i in places) {
            var place = places[i];
            createMarker(place.name, place.geo);
        }
    })

}

function createMarker(name, geo) {

  var marker = new google.maps.Marker({
    window.map,
    position: geo,
    title: name
  });
  var infowindow = new google.maps.InfoWindow({
    content: name
  });
  marker.addListener('click', function() {
    infowindow.open(window.map, marker);
  });
}

window.initMap = initMap;
