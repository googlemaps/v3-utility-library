function init() {
  var myOptions = {
    zoom: 13,
    center: new google.maps.LatLng(45.5, -122.7),
    mapTypeId: 'arcgis',
    mapTypeControlOptions: {
      mapTypeIds: ['arcgis', google.maps.MapTypeId.ROADMAP]
    },
    streetViewControl: true //my favorite feature in V3!
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var baseUrl = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services';
  var wmUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer';
  var dynaUrl = baseUrl + '/Demographics/ESRI_Census_USA/MapServer';
  var agsType = new gmaps.ags.MapType(wmUrl, {
    name: 'ArcGIS'
  });
  map.mapTypes.set('arcgis', agsType);
  var cpc = new gmaps.ags.CopyrightControl(map);
  var dynamap = new gmaps.ags.MapOverlay(dynaUrl);
  dynamap.setMap(map);
}

window.onload = init;
