var map = null;
// keep track of highlight for devices without mouse
var highlighted = null;
var iw = null;

var hStyle = {
  fillColor: '#883333',
  fillOpacity: 0.35,
  strokeColor: '#FF0000',
  strokeWeight: 3,
  zIndex: 100,
  strokeOpacity: 1

};
var style = {
  fillColor: '#333388',
  fillOpacity: 0.35,
  strokeColor: '#FFFFFF',
  strokeWeight: 1,
  strokeOpacity: 1,
  zIndex: 0
};
function init() {
  var myOptions = {
    zoom: 6,
    center: new google.maps.LatLng(43, -106),
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer';
  var layer = new gmaps.ags.Layer(url + '/3');
  var params = {
    returnGeometry: true,
    where: "STATE_NAME = 'Utah'",
    outFields: ["NAME", "POP2000", "POP2007", "POP00_SQMI", "POP07_SQMI"],
    overlayOptions: style
  };
  layer.query(params, processResultSet);
}

function processResultSet(rs) {
  var fs = rs.features;
  for (var i = 0, c = fs.length; i < c; i++) {
    setupFeature(fs[i]);
  }
}

function setupFeature(feat) {
  var a = feat.attributes;
  var html = "<div id='iwdiv' style='font-size:12px'><b>" + a['NAME'] + "</b><hr/>" +
  "<b>2000 Population: </b>" +
  a['POP2000'] +
  "<br/>" +
  "<b>2000 Population per Sq. Mi.: </b>" +
  a['POP00_SQMI'] +
  "<br/>" +
  "<b>2007 Population: </b>" +
  a['POP2007'] +
  "<br/>" +
  "<b>2007 Population per Sq. Mi.: </b>" +
  a['POP07_SQMI'] +
  '</div>';
  var g = feat.geometry[0];//V3 supports multiple rings, so should have only 1 element
  var latlng = getPolyCenter(g);
  g.setMap(map);
  google.maps.event.addListener(g, 'mouseover', function() {
    highlight(g, html, latlng);
  });
  google.maps.event.addListener(g, 'mouseout', function() {
    g.setOptions(style);
    if (iw) {
      iw.close();
    }
  });
  google.maps.event.addListener(g, 'click', function() {
    highlight(g, html, latlng);
  });
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

function highlight(g, html, latlng) {
  if (highlighted) {
    highlighted.setOptions(style);
  }
  g.setOptions(hStyle);
  highlighted = g;
  if (!iw) {
    iw = new google.maps.InfoWindow({
      content: html,
      position: latlng,
      maxWidth: 240
    });
  } else {
    iw.setContent(html);
    iw.setPosition(latlng);
  }
  iw.open(map);
}

window.onload = init;
