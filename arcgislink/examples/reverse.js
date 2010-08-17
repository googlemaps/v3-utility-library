var map, geocoder, iw;
function init() {
  var myOptions = {
    zoom: 17,
    center: new google.maps.LatLng(35.23, -80.84),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  geocoder = new gmaps.ags.GeocodeService('http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer');
  
  marker = new google.maps.Marker({
    position: map.getCenter(),
    draggable: true
  });
  marker.setMap(map);
  google.maps.event.addListener(map, 'click', function(evt) {
    reverseGeocode(evt.latLng);
  });
  google.maps.event.addListener(marker, 'dragend', function(evt) {
    reverseGeocode(evt.latLng);
  });
  google.maps.event.addListener(marker, 'dragstart', function(evt) {
    iw.close();
  });
  iw = new google.maps.InfoWindow({
    maxWidth: 180,
    content: 'Click map or drag marker to get the address of the location'
  });
  iw.bindTo('position', marker, 'position');
  iw.open(map);
}

function reverseGeocode(latlng) {
  if (latlng) {
    var params = {
      location: latlng,
      distance: 100
    }
    geocoder.reverseGeocode(params, function(result) {
      if (result.address) {
        var html = '';
        var attrs = result.address;
        for (var x in attrs) {
          if (attrs.hasOwnProperty(x)) {
            html += x + ': ' + attrs[x] + '<br/>';
          }
        }
        marker.setPosition(result.location);
        iw.setContent(html);
        iw.open(map);
      } else {
        alert('can not find address for point:' + latlng.toString());
      }
    });
  }
  
}

window.onload = init;
