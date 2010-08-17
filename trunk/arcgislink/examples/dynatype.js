function init() {
  var myOptions = {
    zoom: 14,
    center: new google.maps.LatLng(45.5, -122.7),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
      mapTypeIds: ['arcgis', google.maps.MapTypeId.ROADMAP]
    },
    streetViewControl: true //my favorite feature in V3!
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer';
  var agsType = new gmaps.ags.MapType(url, {
    name: 'ArcGIS'
  });
  map.mapTypes.set('arcgis', agsType);
  map.overlayMapTypes.insertAt(0, agsType);
}

window.onload = init;
