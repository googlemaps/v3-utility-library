var map, ov, iw, svc, marker;
function init() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(40, -100),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    draggableCursor: 'default'
  }
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  loadMapService();
  google.maps.event.addListener(map, 'click', function(e) {
    doIdentify(e.latLng);
  });
  google.maps.event.addListener(map, 'zoom_changed', updateTOC);
  google.maps.event.addListener(gmaps.ags.Util, 'jsonpstart', function() {
    document.getElementById('working').style.visibility = 'visible';
  });
  google.maps.event.addListener(gmaps.ags.Util, 'jsonpend', function() {
    document.getElementById('working').style.visibility = 'hidden';
  });
}

function loadMapService() {
  var el = document.getElementById('svc');
  var s = el.options[el.selectedIndex].text;
  var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/' + s;
  if (ov != null) {
    if (ov instanceof gmaps.ags.MapOverlay) {
      ov.setMap(null);
    } else if (ov instanceof gmaps.ags.MapType) {
      map.overlayMapTypes.removeAt(0);
    }
    ov = null;
  }
  svc = new gmaps.ags.MapService(url);
  google.maps.event.addListener(svc, 'load', function() {
    var bnds = svc.getInitialBounds();
    if (bnds) {
      if (bnds.getSouthWest().lng() > bnds.getNorthEast().lng()) {
        map.setCenter(new google.maps.LatLng(40, -100));
        map.setZoom(4);
      } else if (!bnds.contains(map.getCenter())){
        map.fitBounds(bnds);
      }
    }
    var op = document.getElementById('op').value;
    if (svc.singleFusedMapCache) {
      ov = new gmaps.ags.MapType(svc, {
        opacity: op
      });
      map.overlayMapTypes.insertAt(0, ov);
    } else {
      ov = new gmaps.ags.MapOverlay(svc, {
        opacity: op
      });
      ov.setMap(map);
    }
    
    
    var svcInfo = 'This is a <b>dynamic</b> map svc. You can turn on/off individual layers using the check box.'
    if (svc.singleFusedMapCache) {
      svcInfo = 'This is a <b>cached</b> map svc. You can <b>NOT</b> turn on/off individual layers.'
    }
    document.getElementById('svcInfo').innerHTML = svcInfo;
    document.getElementById('svcDesc').innerHTML = svc.description + '<br/>Copyright:' + svc.copyrightText;
    var clickOpts = ' <select id="clickOpts" style="font-size:9pt;width:200px" onchange="onClickOptionChanged()">';
    clickOpts += '<option value="top">&lt;Top-most layer&gt;</option>';
    clickOpts += '<option value="visible">&lt;Visible layers&gt;</option>';
    clickOpts += '<option value="all">&lt;All layers&gt;</option>';
    var layers = svc.layers;
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      // now fetch the scale info for each layer.
      google.maps.event.addListenerOnce(layer, 'load', updateTOC);
      layer.load();
      if (!layer.subLayerIds) {
        clickOpts += '<option value="all:' + i + '">' + layer.name + '</option>';
      }
    }
    document.getElementById('clickOptsDiv').innerHTML = clickOpts + '</select>';
  });
  
}

/**
 * Create layer list.
 */
function updateTOC() {
  if (ov && svc.hasLoaded()) {
    var toc = '';
    var scale = 591657527.591555 / (Math.pow(2, map.getZoom()));//591657527.591555 is the scale at level 0
    var layers = svc.layers;
    for (var i = 0; i < layers.length; i++) {
      var layer = layers[i];
      var inScale = layer.isInScale(scale);
      toc += '<div style="color:' + (inScale ? 'black' : 'gray') + '">';
      if (layer.subLayerIds) {
        toc += layer.name + '(group)<br/>';
      } else {
        if (layer.parentLayer) {
          toc += '&nbsp;&nbsp;&nbsp;&nbsp;';
        }
        toc += '<input type="checkbox" id="layer' + layer.id + '"';
        if (layer.visible) {
          toc += ' checked="checked"';
        }
        if (!inScale || svc.singleFusedMapCache) {
          toc += ' disabled="disabled"';
        }
        toc += ' onclick="setLayerVisibility()">' + layer.name + '<br/>';
      }
      toc += '</div>';
    }
    document.getElementById('toc').innerHTML = toc;
  }
  
}

/**
 * Check the visibility of layers and refresh map
 */
function setLayerVisibility() {
  var layers = svc.layers;
  for (var i = 0; i < layers.length; i++) {
    var el = document.getElementById('layer' + layers[i].id);
    if (el) {
      layers[i].visible = (el.checked === true);
    }
  }
  ov.refresh();
}


function onClickOptionChanged() {
  if (marker != null) {
    doIdentify(marker.getPosition());
  }
}

function doIdentify(location) {
  if (!location) 
    return;
  var layerOpt = document.getElementById('clickOpts').value;
  if (ov && svc.hasLoaded()) {
    var params = {
      geometry: location,
      layerOption: layerOpt || 'top',
      tolerance: 5,
      bounds: map.getBounds(),
      width: map.getDiv().offsetWidth,
      height: map.getDiv().offsetHeight,
      returnGeometry: false
    };
    svc.identify(params, function(res, err) {
      if (err) {
        alert(err.message + '\n' + err.details.join('\n'));
      } else if (res.results) {
        processIdentifyResults(res, location);
      }
    });
  }
}

function processIdentifyResults(res, ll) {
  var html = '';
  if (res.results) {
    html += 'Total # of Results:' + res.results.length;
    for (var i = 0, c = res.results.length; i < c; i++) {
      var r = res.results[i];
      if (i > 0) {
        html += '<hr/>';
      }
      html += '<div>Result #' + (i + 1) + ': <i>' + r.value + '</i><br/><table>';
      html += '<tr><td>From layer: <b>' + r.layerName + '</b></td></tr>';
      html += '<tr><td > <table style="font-size:9pt">';
      var a = r.feature.attributes;
      for (var x in a) {
        if (a.hasOwnProperty(x)) {
          html += '<tr>';
          html += '<td style="background-color:#DDDDDD;">' + x + '</td>';
          var val = a[x];
          val = (val === null || typeof val === 'undefined') ? '' : '' + val;
          html += '<td>' + val + '</td></tr>';
        }
      }
      html += '</table></td></tr></table></div>';
      
    }
    document.getElementById('info').innerHTML = html;
    if (marker == null) {
      marker = new google.maps.Marker({
        position: ll,
        map: map
      });
    } else {
      marker.setPosition(ll);
    }
    
  }
  
}
function setOVOpacity(op){
  if (ov) {
    ov.setOpacity(op);
  }
}
window.onload = init;

window['setLayerVisibility'] = setLayerVisibility;
window['loadMapService']= loadMapService;
window['setOVOpacity'] = setOVOpacity;
