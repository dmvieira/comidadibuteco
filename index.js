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
        var markers = [];
        var info = []
        var markersInfo = new Object();
        markersInfo.markers = markers;
        markersInfo.info = info;
        for (var i in places) {
            var place = places[i];
            var result = createMarker(
              place.name, place.geo, place.url, place.food, place.food_desc, place.work_hours, place.contact);
            markersInfo.info.push(result.info);
            markersInfo.markers.push(result.marker);
        };
        return markersInfo;
    }).then(function(markersInfo){
        const markers = markersInfo.markers;
        new markerClusterer.MarkerClusterer({ markers, map });
        return markersInfo.info;
    })
    .then(function(info){
      google.maps.event.addListener(map, "click", function(event) {
        for (var i = 0; i < info.length; i++ ) { 
          info[i].close();
        };
      });
    })
}

function checkAndInit(){
  if (navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(initMap, initMap);
  } else {
    return initMap({});
  }
}

function createMarker(name, geo, url, food, foodDesc, workHours, contact) {

  var marker = new google.maps.Marker({
    map,
    position: geo,
    title: name
  });
  var message = "<h3><a href='"+url+"' target='_blank'>"+name+"</a></h3><p><strong>"+food+"</strong><br />"+foodDesc+"</p>";

  if (workHours !== ''){
    message += "<p><br />Aberto: "+workHours+"</p>"
  }

  if (contact !== ''){
    message += "<p><br />Contato: "+contact+"</p>"
  }

  var infowindow = new google.maps.InfoWindow({
    content: message
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
  return {info: infowindow, marker: marker};
}

window.initMap = checkAndInit;
