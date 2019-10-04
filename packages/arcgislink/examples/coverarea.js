var map, task, iw;
var polys = [];
var colors = ['#ff0000', '#ffff00', '#00ff00'];
function init() {
  var myOptions = {
    zoom: 13,
    center: new google.maps.LatLng(35.23, -80.84),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Network/ESRI_DriveTime_US/GPServer/CreateDriveTimePolygons';
  task = new gmaps.ags.GPTask(url);
  
  google.maps.event.addListener(map, 'click', function(evt) {
    calcArea(evt.latLng);
  });
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
  iw = new google.maps.InfoWindow({
    maxWidth: 200,
    content: 'Click map to get coverage area for driving time 1,2,3 min from that location.',
    position: map.getCenter()
  });
  iw.open(map);
}

function clear() {
  for (var i = 0; i < polys.length; i++) {
    polys[i].setMap(null);
  }
  polys.length = 0;
  if (iw) {
    iw.close();
    iw = null;
  }
}

function calcArea(pt) {
  clear();
  var params = {
    'Input_Location': {
      features: [{
        geometry: pt
      }],
      spatialReference: {
        wkid: 4326
      } //gmaps.ags.SpatialReference.WGS84
    },
    'Drive_Times': '1 3 5'
  };
  task.execute({
    parameters: params
  }, function(gpres, err) {
    if (!err) {
      var res, loc, f, g;
      for (var i = 0; i < gpres.results.length; i++) {
        res = gpres.results[i];
        for (var j = 0, J = res.value.features.length; j < J; j++) {
          f = res.value.features[j];
          if (f.geometry) {
            for (var k = 0, K = f.geometry.length; k < K; k++) {
              g = f.geometry[k];
              polys.push(g);
              g.setMap(map);
              g.setOptions({
                fillColor: colors[polys.length % colors.length]
              })
            }
          }
        }
      }
    } else {
      alert(err.message + err.details.join(','));
    }
  });
}

window.onload = init;
