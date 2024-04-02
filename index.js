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
        var markersAndInfo = [];
        for (var i in places) {
            var place = places[i];
            markersAndInfo.push(createMarker(
              place.name, place.geo, place.url, place.food, place.food_desc, place.work_hours, place.contact));
        };
        return markersAndInfo
    })
    .then(function(markersAndInfo){
      google.maps.event.addListener(map, "click", function(event) {
        for (var i = 0; i < markersAndInfo.length; i++ ) { 
          markersAndInfo[i].info.close();
        }   
    })
    return markersAndInfo;
  }).then(function(markersAndInfo){
    for (var i = 0; i < markersAndInfo.length; i++ ) { 
      markersAndInfo[i].marker.addListener('click', function(event){
        for (var j = 0; j < markersAndInfo.length; j++ ) {
          if (i !== j){
            markersAndInfo[j].info.close();
          }
        }
      })
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
