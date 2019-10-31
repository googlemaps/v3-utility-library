function init() {
  var myOptions = {
    zoom: 17,
    center: new google.maps.LatLng(45.5, -122.7),
    mapTypeId: google.maps.MapTypeId.HYBRID,
    streetViewControl: true //my favorite feature in V3!
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer';
  var agsType = new gmaps.ags.MapType(url, {
    name: 'ArcGIS',
    opacity: 0.5
  });//
  map.overlayMapTypes.insertAt(0, agsType);
}

window.onload = init;
