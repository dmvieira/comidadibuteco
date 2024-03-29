let map;


function initMap(position) {
  const rio = new google.maps.LatLng(-22.958296, -43.257151);

  if (position.coords) {
    map = new google.maps.Map(document.getElementById("map"), {
      center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
      zoom: 12
    });
  }
  else {
    map = new google.maps.Map(document.getElementById("map"), {
      center: rio,
      zoom: 4
    });
  }


  fetch("./places.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(places){
        for (var i in places) {
            var place = places[i];
            createMarker(place.name, place.geo, place.url, place.food, place.food_desc);
        }
    })

}

function checkAndInit(){
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(initMap, initMap);
  } else {
    return initMap({});
  }
}

function createMarker(name, geo, url, food, foodDesc) {

  var marker = new google.maps.Marker({
    map,
    position: geo,
    title: name
  });
  var infowindow = new google.maps.InfoWindow({
    content: "<h3><a href='"+url+"' target='_blank'>"+name+"</a></h3><p><strong>"+food+"</strong><br />"+foodDesc+"</p>"
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
}

window.initMap = checkAndInit;
