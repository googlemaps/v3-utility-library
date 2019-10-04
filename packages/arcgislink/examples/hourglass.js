function init() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40, -100),//35.23, -80.84),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: true //my favorite feature in V3!
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer';
  var dynamap = new gmaps.ags.MapOverlay(url);//, { opacity: 0.5 });
  google.maps.event.addListener(dynamap, 'drawstart', function() {
    document.getElementById('drawing').style.visibility = 'visible';
    
  });
  google.maps.event.addListener(dynamap, 'drawend', function() {
    document.getElementById('drawing').style.visibility = 'hidden';
  });
  dynamap.setMap(map);
  // the following use cursor to indicate busy
  google.maps.event.addListener(gmaps.ags.Util, 'jsonpstart', function() {
    map.setOptions({
      draggableCursor: 'wait'
    });
  });
  google.maps.event.addListener(gmaps.ags.Util, 'jsonpend', function() {
    map.setOptions({
      draggableCursor: 'url(http://maps.gstatic.com/intl/en_us/mapfiles/openhand_8_8.cur),default'//inherit'
    });
  });
}

window.onload = init;
