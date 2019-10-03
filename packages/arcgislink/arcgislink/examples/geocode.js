var map, geocoder, iw, markers, form;
function init() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40, -100),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  geocoder = new gmaps.ags.GeocodeService('http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Locators/ESRI_Geocode_USA/GeocodeServer');
  google.maps.event.addListenerOnce(geocoder, 'load', function() {
    var fields = geocoder.addressFields;
    form = '';
    for (var i = 0; i < fields.length; i++) {
      form += fields[i].alias + ': <input type=text size=25 id="' + fields[i].name + '"/><br/>';
    }
    form += '<input type="button" onclick="geocode()" value="Geocode!"/>';
    iw = new google.maps.InfoWindow({
      maxWidth: 200,
      content: form,
      position: map.getCenter()
    });
    iw.open(map);
    
  });
  
  
}

function geocode() {
  if (markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
  }
  /*
   * inputs = {
   Address: '380 new york st',
   State: 'CA',
   City: 'redlands',
   Zip: '92373'
   }
   */
  var inputs = {};
  var fields = geocoder.addressFields;
  for (var i = 0; i < fields.length; i++) {
    inputs[fields[i].name] = document.getElementById(fields[i].name).value;
  }
  geocoder.findAddressCandidates({
    inputs: inputs
  }, function(results) {
    markers = [];
    if (results.candidates) {
      for (var i = 0, c = results.candidates.length; i < c; i++) {
        var marker = createMarker(results.candidates[i]);
        marker.setMap(map);
        markers.push(marker);
        if (i == 0) {
          map.setCenter(marker.getPosition());
          map.setZoom(15);
          google.maps.event.trigger(marker, 'click');
        }
      }
    }
  });
}

function createMarker(gc) {
  var html = 'Matched Address:' + gc.address + '<br/>' +
  'Score:' +
  gc.score +
  '<br/>';
  if (gc.attributes) {
    var attrs = gc.attributes;
    for (var x in attrs) {
      if (attrs.hasOwnProperty(x)) {
        html += x + attrs[x] + '<br/>';
      }
    }
  }
  var latlng = gc.location;
  var marker = new google.maps.Marker({
    title: gc.address,
    position: latlng
  });
  google.maps.event.addListener(marker, 'click', function() {
    iw.setContent(form + '<br/>' + html);
    iw.setPosition(latlng);
    iw.open(map);
  });
  return marker;
}

window.onload = init;
window['geocode'] = geocode;
