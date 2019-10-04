var map, svc, iw, pt;
//gmaps.ags.Config.proxyUrl = '/proxy/proxy.ashx';
function init() {
  var myOptions = {
    zoom: 15,
    center: new google.maps.LatLng(61.18, -149.86),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    draggableCursor: 'default'
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  svc = new gmaps.ags.GeometryService('http://sampleserver1.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer');
  
  google.maps.event.addListener(map, 'click', function(evt) {
    projectTo(evt.latLng);
  });
  
  iw = new google.maps.InfoWindow({
    maxWidth: 200,
    content: 'Click map to project the clicked point to Alaska Albers Feet Projection',
    position: map.getCenter()
  });
  iw.open(map);
}

function projectToLatLng() {
  var params = {
    geometries: [pt],
    geometryType: gmaps.ags.GeometryType.POINT,
    inSpatialReference: 2964,
    outSpatialReference: 4326
  };
  svc.project(params, function(projectResults, err) {
    if (!err) {
      //projectResults.geometries is array of array
      var marker = projectResults.geometries[0][0];
      var latlng = marker.getPosition();
      alert(latlng.toString());
    } else {
      alert(err.message + err.details.join(','));
    }
  });
}

function projectTo(latlng) {
  // NAD_1927_Alaska_Albers_Feet: 
  // PROJCS["NAD_1927_Alaska_Albers_Feet",GEOGCS["GCS_North_American_1927",DATUM["D_North_American_1927",SPHEROID["Clarke_1866",6378206.4,294.9786982]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Albers"],PARAMETER["False_Easting",0.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",-154.0],PARAMETER["Standard_Parallel_1",55.0],PARAMETER["Standard_Parallel_2",65.0],PARAMETER["Latitude_Of_Origin",50.0],UNIT["Foot_US",0.3048006096012192]]
  if (latlng) {
    var params = {
      geometries: [latlng],
      outSpatialReference: 2964,
      inSpatialReference: 4326
    }
    svc.project(params, function(results, err) {
      if (!err) {
        pt = results.geometries[0];
        var html = latlng.toString() + '<br/><b>NAD_1927_Alaska_Albers</b><p> x: ' + pt.x + ', <br/> y: ' + pt.y;
        html += '<br><input type="button" value="Back to LatLong" onclick="projectToLatLng();" />';
        iw.setPosition(latlng);
        iw.setContent(html);
        iw.open(map);
      } else {
        alert(err.message + err.details.join(','));
      }
    });
  }
  
}

window.onload = init;
window['projectToLatLng'] = projectToLatLng;
