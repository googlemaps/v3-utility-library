
function log(s) {
  var d = document.getElementById('log');
  d.innerHTML = d.innerHTML + s + "</br>";
}

function showInfo(svc) {
  log('description:' + svc.description);
  log('layers:');
  var layers = svc.layers;
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    log('  layer' + layer.id + ':' + layer.name + ' (' + layer.url);
  }
  var tables = svc.tables;
  if (tables) {
    log('tables:');
    for (var i = 0; i < tables.length; i++) {
      var layer = tables[i];
      log('table' + layer.id + ':' + layer.name + ' (' + layer.url);
    }
  }
}

function loadSvc() {
  document.getElementById('log').innerHTML = '';
  var sel = document.getElementById('services');
  var url = sel.options[sel.selectedIndex].text;
  var svc = new gmaps.ags.MapService(url);
  google.maps.event.addListener(svc, 'load', function() {
    showInfo(svc);
  });
}

function testLCC() {
  var sr = new gmaps.ags.LambertConformalConic({
    wkid: 9999,
    semi_major: 6378206.4,
    inverse_flattening: 294.9786982,
    standard_parallel_1: 33,
    standard_parallel_2: 45,
    central_meridian: -96.0,
    latitude_of_origin: 23,
    false_easting: 0,
    false_northing: 0,
    unit: 1
  });
  log ('LCC NCSP83');
  var ll = [-75, 35];
  log('ll='+ll.join(','));
  var xy = sr.forward(ll);
  log('expected:1894410.9, 1564649.5, xy='+xy.join(','));
  var xy1 = [1894410.9, 1564649.5]
  var ll1 = sr.inverse(xy1);
   log('expected:-75, 35, ll='+ll1.join(','));      
}
function testSRregister(){
  var sr = gmaps.ags.SpatialReference.register(2264, 'PROJCS["NAD_1983_StatePlane_North_Carolina_FIPS_3200_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",2000000.002616666],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-79.0],PARAMETER["Standard_Parallel_1",34.33333333333334],PARAMETER["Standard_Parallel_2",36.16666666666666],PARAMETER["Latitude_Of_Origin",33.75],UNIT["Foot_US",0.3048006096012192]]');   
  log ('SpatialReference.register NCSP83');
  var ll = [-80.5666,35.102363];
  log('ll='+ll.join(','));
  var xy = sr.forward(ll);
  log('expected:1531463.95, 495879.744, xy='+xy.join(','));
  var xy1 = [1531463.95, 495879.744]
  var ll1 = sr.inverse(xy1);
  log('expected:-80.5666,35.102363, ll='+ll1.join(','));      
}
function init() {
  var url = 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer';
  gmaps.ags.Util.getJSON(url, {}, 'callback', function(json) {
    var j = json;
    log('layerdesc:' +j.serviceDescription);
  });
  //testLCC();
  //testSRregister();
}

window['loadSvc'] = loadSvc;
window.onload = init;
