function init() {
  var services = {
    'USA Topo': ['USA_Topo_Maps'],
    'Streets': ['World_Street_Map'],
    'World Topo': ['World_Topo_Map'],
    'Imagery': ['World_Imagery'],
    'Labeled Imagery': ['World_Imagery', 'Reference/World_Boundaries_and_Places'],
    'Terrain': ['World_Terrain_Base'],
    'Labeled Terrain': ['World_Terrain_Base', 'Reference/World_Reference_Overlay']
  };
  var agsIds = [];
  var agsTypes = [];
  for (var x in services) {
    if (services.hasOwnProperty(x)) {
      agsIds.push(x);
      var urls = services[x];
      for (var i = 0; i < urls.length; i++) {
        urls[i] = 'http://services.arcgisonline.com/ArcGIS/rest/services/' + urls[i] + '/MapServer';
      }
      agsTypes.push(new gmaps.ags.MapType(urls, {
        name: x
      }));
    }
  }
  var myOptions = {
    zoom: 13,
    center: new google.maps.LatLng(35.227, -80.84),//36.215471,-112.332458),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
      mapTypeIds: agsIds
    }
  }
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  for (var i = 0; i < agsIds.length; i++) {
    map.mapTypes.set(agsIds[i], agsTypes[i]);
  }
  map.setMapTypeId('World Topo')
}
window.onload = init;
