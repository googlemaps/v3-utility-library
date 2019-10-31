// register NC SP83
var sp = gmaps.ags.Util.registerSR(2264, 'PROJCS["NAD_1983_StatePlane_North_Carolina_FIPS_3200_Feet",GEOGCS["GCS_North_American_1983",DATUM["D_North_American_1983",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Lambert_Conformal_Conic"],PARAMETER["False_Easting",2000000.002616666],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-79.0],PARAMETER["Standard_Parallel_1",34.33333333333334],PARAMETER["Standard_Parallel_2",36.16666666666666],PARAMETER["Latitude_Of_Origin",33.75],UNIT["Foot_US",0.3048006096012192]]');
function init() {

  var url = 'http://maps.ci.charlotte.nc.us/ArcGIS/rest/services/GET/BaseMap/MapServer';
  var svc = new gmaps.ags.MapService(url);
  google.maps.event.addListenerOnce(svc, 'load', function() {
    try {
      var tileLayer = new gmaps.ags.TileLayer(svc);
      var agsType = new gmaps.ags.MapType([tileLayer], {
        name: 'StatePlane'
      });
      var bnds = svc.getInitialBounds();
      var myOptions = {
        zoom: 12,
        center: bnds.getCenter(),
        mapTypeId: 'stateplane',
        mapTypeControlOptions: {
          mapTypeIds: ['stateplane', google.maps.MapTypeId.ROADMAP]
        }
      }
      var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
      map.mapTypes.set('stateplane', agsType);
      google.maps.event.addListener(map, 'mousemove', function(e) {
        window.status = sp.forward([e.latLng.lng(), e.latLng.lat()]).join(',');
      })
    } catch (e) {
      alert(e);
    }
  });
}

window.onload = init;
