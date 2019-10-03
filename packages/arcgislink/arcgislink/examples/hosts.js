
function init() {
  var myOptions = {
    zoom: 14,
    center: new google.maps.LatLng(35.227, -80.84),
    mapTypeId: 'arcgis',//google.maps.MapTypeId.ROADMAP
    mapTypeControlOptions: {
      mapTypeIds: ['arcgis']//,google.maps.MapTypeId.ROADMAP]
    },
    streetViewControl: true //my favorite feature in V3!
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://maps.ci.charlotte.nc.us/ArcGIS/rest/services/GET/BaseMapWM/MapServer';
  var tileLayer = new gmaps.ags.TileLayer(url, {
    hosts: 'mt[4].ci.charlotte.nc.us'
  })
  var agsType = new gmaps.ags.MapType([tileLayer], {
    name: 'ArcGIS'
  });
  map.mapTypes.set('arcgis', agsType);
  map.setMapTypeId('arcgis');
}

window.onload = init;
