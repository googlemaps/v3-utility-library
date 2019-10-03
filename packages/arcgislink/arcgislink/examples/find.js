var results = [], map, service, iw;
function init() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40, -100),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  service = new gmaps.ags.MapService("http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer");
  google.maps.event.addListenerOnce(service, 'load', function() {
    document.getElementById('find').disabled = false;
  });
  google.maps.event.addListener(gmaps.ags.Util, 'jsonpstart', function() {
    document.getElementById('busy').style.visibility = 'visible';
  });
  google.maps.event.addListener(gmaps.ags.Util, 'jsonpend', function() {
    document.getElementById('busy').style.visibility = 'hidden';
  });
  iw = new google.maps.InfoWindow();
}


// find results ...
function find(q) {
  removeOverlays();
  if (iw) 
    iw.close();
  document.getElementById('results').innerHTML = '';
  var exact = document.getElementById('exact').checked;
  var params = {
    returnGeometry: true,
    searchText: q,
    contains: !exact,
    layerIds: [0, 2], // city, state
    searchFields: ["CITY_NAME", "NAME", "SYSTEM", "STATE_ABBR", "STATE_NAME"],
    sr: 4326
  };
  service.find(params, processFindResults);
}


function processFindResults(rs) {
  var fs = rs.results;
  for (var i = 0, c = fs.length; i < c; i++) {
    processFindResult(fs[i]);
  }
}


function processFindResult(res) {
  var feat = res.feature;
  var ovs = feat.geometry;
  var a = feat.attributes;
  var title = res.layerName + ':' + res.foundFieldName + ' = ' + res.value + '<br/>';
  var html = '<div style="width:200px;height:200px;overflow:auto;font-size:small">';
  html += '<b>' + title + '</b>';
  for (var x in a) {
    if (a.hasOwnProperty(x)) {
      html += x + ': ' + a[x] + '<br/>';
    }
  }
  html += '</div>';
  for (var j = 0, jc = ovs.length; j < jc; j++) {
    var ov = ovs[j];
    google.maps.event.addListener(ov, 'click', function() {
      var latlng = ov.getPosition ? ov.getPosition() : getPolyCenter(ov);
      iw.setContent(html);
      iw.setPosition(latlng);
      iw.open(map);
    });
    results.push(ov);
    ov.setMap(map);
  }
  
  var side = document.getElementById('results');
  var row = '<div onclick="highlight(' + (results.length - 1) + ')" onmouseover="this.style.backgroundColor=\'#AAAAEE\'" onmouseout="this.style.backgroundColor=\'#FFFFFF\'">' + title + '</div>'
  side.innerHTML += row;
}

function highlight(i) {
  var ov = results[i];
  if (ov) {
    google.maps.event.trigger(ov, 'click');
  }
}

function getPolyCenter(poly) {
  var paths, path, latlng;
  var lat = 0;
  var lng = 0;
  var c = 0;
  paths = poly.getPaths();
  for (var j = 0, jc = paths.getLength(); j < jc; j++) {
    path = paths.getAt(j);
    for (var k = 0, kc = path.getLength(); k < kc; k++) {
      latlng = path.getAt(k);
      lat += latlng.lat();
      lng += latlng.lng();
      c++;
    }
  }
  if (c > 0) {
    return new google.maps.LatLng(lat / c, lng / c);
  }
  return null;
}

function removeOverlays() {
  if (results) {
    for (var i = 0; i < results.length; i++) {
      results[i].setMap(null);
    }
    results.length = 0;
  }
}

window.onload = init;
window['find'] = find;
window['highlight']= highlight;
