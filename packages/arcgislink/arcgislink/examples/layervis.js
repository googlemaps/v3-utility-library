var dynamap;
var map;

function init() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40, -95),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: true
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer';
  dynamap = new gmaps.ags.MapOverlay(url, {
    opacity: 0.5
  });
  
  google.maps.event.addListenerOnce(dynamap.getMapService(), 'load', function() {
    dynamap.setMap(map);
    var service = dynamap.getMapService();
    
    var toc = '';
    for (var i = 0; i < service.layers.length; i++) {
      toc += '<input type="checkbox" id="layer' + service.layers[i].id + '"';
      if (service.layers[i].visible) 
        toc += ' checked="checked"';
      toc += ' onclick="setVis()">' + service.layers[i].name + '<br/>';
    }
    document.getElementById('toc').innerHTML = toc;
    
  });
  
  
}

function setVis() {
  var service = dynamap.getMapService();
  for (var i = 0; i < service.layers.length; i++) {
    var el = document.getElementById('layer' + service.layers[i].id);
    service.layers[i].visible = (el.checked === true);
  }
  dynamap.refresh();
}

window['setVis']=setVis;
window.onload = init;
