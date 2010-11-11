function init() {
  var myOptions = {
    zoom: 15,
    center: new google.maps.LatLng(45.5, -122.7),
    mapTypeId: 'arcgis',//google.maps.MapTypeId.ROADMAP
    mapTypeControlOptions: {
      mapTypeIds: ['arcgis']//,google.maps.MapTypeId.ROADMAP]
    },
    streetViewControl: true //my favorite feature in V3!
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer';
  var agsType = new gmaps.ags.MapType(url, {
    name: 'ArcGIS'
  });
  map.mapTypes.set('arcgis', agsType);
  map.setMapTypeId('arcgis');
 

}
window.onload = init;