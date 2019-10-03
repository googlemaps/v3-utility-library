var map, iw, task;
gmaps.ags.Config.proxyUrl = '/proxy/proxy.ashx';
var stops = [];
var barriers = [];
var routes = [];
function init() {
  var myOptions = {
    zoom: 12,
    center: new google.maps.LatLng(35.23, -80.84),//37.8, -122.41
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControlOptions: {
      mapTypeIds: [google.maps.MapTypeId.ROADMAP]
    },
    draggableCursor: 'default'
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  task = new gmaps.ags.RouteTask('http://tasks.arcgisonline.com/ArcGIS/rest/services/NetworkAnalysis/ESRI_Route_NA/NAServer/Route');
  //'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route');
  google.maps.event.addListener(map, 'click', addPoint);
  
  showHelp();
}

function showBusy(b) {
  map.setOptions({
    draggableCursor: b ? 'wait' : 'default'
  });
}

function addPoint(evt) {
  if (iw) {
    iw.close();
    iw = null;
  }
  var isStop = getPointType() == 0;
  var arr = isStop ? stops : barriers;
  var icon;
  if (isStop) {
    icon = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + (stops.length + 1) + "|00ff00|000000");
  } else {
    icon = new google.maps.MarkerImage("http://chart.apis.google.com/chart?cht=itr&chs=24x24&chco=FF0000,000000ff,ffffff01&chl=x&chx=000000,0&chf=bg,s,00000000&ext=.png", null, null, new google.maps.Point(12, 12));
  }
  var marker = new google.maps.Marker({
    position: evt.latLng,
    map: map,
    icon: icon,
    draggable: true
  });
  
  arr.push(marker);
  google.maps.event.addListener(marker, 'click', function() {
    marker.setMap(null);
    for (var i = 0, I = arr.length; i < I; i++) {
      if (arr[i] == marker) {//marker.container_
        arr.splice(i, 1);
        break;
      }
    }
    marker = null;
  });
  
}

function route() {
  gmaps.ags.Util.removeFromMap(routes);
  routes = [];
  showBusy(true);
  task.solve({
    stops: stops,
    barriers: barriers,
    findBestSequence: document.getElementById('optimize').checked,
    overlayOptions: {
      strokeColor: '#0000BB',
      strokeWeight: 8,
      strokeOpacity: 0.5,
      clickable: false
    }
  }, processResults, handleErr);
  
}

function processResults(results) {
  showBusy(false);
  if (results.routes) {
    var r = results.routes.features;
    for (var i = 0, I = r.length; i < I; i++) {
      gmaps.ags.Util.addToMap(map, r[i].geometry);
      routes = routes.concat(r[i].geometry);
    }
  }
}

function handleErr(err) {
  showBusy(false);
  if (err) {
    alert(err.message + '\n' + err.details.join('\n'));
  }
}

function getPointType() {
  var r = document.getElementById('frm')['pointType'];// for adv compile
  for (var i = 0, I = r.length; i < I; i++) {
    if (r[i].checked) {
      return r[i].value;
    }
  }
}

function clearOverlays() {
  gmaps.ags.Util.removeFromMap(routes, true);
  gmaps.ags.Util.removeFromMap(stops, true);
  gmaps.ags.Util.removeFromMap(barriers, true);
}

function showHelp() {
  iw = iw ||
  new google.maps.InfoWindow({
    maxWidth: 250,
    content: '<ul><li>Choose stop or barrier at top<li>Click map to add a stop or barrier<li>click marker to remove, drag to move<li>click route button to get directions'
  });
  iw.bindTo('position', map, 'center');
  iw.open(map);
}

window.onload = init;
window['route'] = route;
window['clearOverlays'] = clearOverlays;
window['showHelp'] = showHelp;

