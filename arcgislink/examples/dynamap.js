function init() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40, -100),//35.23, -80.84),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: true //my favorite feature in V3!
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer';
  var cpc = new gmaps.ags.CopyrightControl(map);
  var dynamap = new gmaps.ags.MapOverlay(url, { opacity: 0.5 });
  dynamap.setMap(map);
}

window.onload = init;
