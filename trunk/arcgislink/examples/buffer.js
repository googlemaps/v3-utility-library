var map, svc, iw, skip;
var poly, map;
var markers = [];
var buffers = [];
var path = new google.maps.MVCArray();
// If very complex geometry then it's a good idea to set up your proxy.
//gmaps.ags.Config.proxyUrl = '/proxy/proxy.ashx';


function init() {
  var myOptions = {
    zoom: 15,
    center: new google.maps.LatLng(35.23, -80.84),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP]
    }
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  poly = new google.maps.Polygon({
    strokeWeight: 3,
    fillColor: '#5555FF'
  });
  poly.setMap(map);
  poly.setPaths(new google.maps.MVCArray([path]));
  
  google.maps.event.addListener(map, 'click', addPoint);
  svc = new gmaps.ags.GeometryService('http://sampleserver3.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer');
  iw = new google.maps.InfoWindow({
    maxWidth: 250,
    content: 'Draw polygon by:<ul><li>Click map to add a Vertex<li>Drag marker to adjust<li>Click marker to delete vertex</ul><!--center><button onclick="closeWin()">OK</button></center-->',
    position: map.getCenter()
  });
  iw.open(map);
}

function addPoint(event) {
  // maybe a V3 bug: map click event should not triger by poly click
  if (iw) {
    iw.close();
    iw = null;
  }
  
  path.insertAt(path.length, event.latLng);
  
  var marker = new google.maps.Marker({
    position: event.latLng,
    map: map,
    draggable: true
  });
  markers.push(marker);
  marker.setTitle("#" + path.length);
  
  google.maps.event.addListener(marker, 'click', function() {
    marker.setMap(null);
    for (var i = 0, I = markers.length; i < I; i++) {
      if (markers[i] == marker) {
        markers.splice(i, 1);
        path.removeAt(i);
        break;
      }
    }
    doBuffer();
  });
  
  google.maps.event.addListener(marker, 'dragend', function() {
    for (var i = 0, I = markers.length; i < I; i++) {
      if (markers[i] == marker) {
        path.setAt(i, marker.getPosition());
        break;
      }
    }
    doBuffer();
  });
  doBuffer();
}

function doBuffer() {
  if (markers.length > 2) {
    for (var i = 0; i < buffers.length; i++) {
      buffers[i].setMap(null);
    }
    buffers.length = 0;
    var params = {
      geometries: [poly],
      bufferSpatialReference: 102113,//gmaps.ags.SpatialReference.WEB_MERCATOR,
      distances: [500, 1000],
      unit: 9001,
      unionResults: true, overlayOptions:{clickable:false}
    };
    svc.buffer(params, function(results, err) {
      if (!err) {
        var g;
        for (var i = 0, I = results.geometries.length; i < I; i++) {
          for (var j = 0, J = results.geometries[i].length; j < J; j++) {
            g = results.geometries[i][j];
            g.setMap(map);
            buffers.push(g);
          }
        }
      } else {
        alert(err.message + err.details.join(','));
      }
    });
  }
  
  
}
function closeWin(){
  if (iw) {
    iw.close();
  }
}
window.onload = init;
window['closeWin'] = closeWin;
