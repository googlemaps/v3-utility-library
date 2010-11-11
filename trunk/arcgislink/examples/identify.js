goog.require('goog.dom');
goog.require('goog.ui.Tab');
goog.require('goog.ui.TabBar');
       
  
var svc, map, res, iw, ovs = [], layers;
var ovOptions = {
  polylineOptions: {
    strokeColor: '#FF0000',
    strokeWeight: 4
  },
  polygonOptions: {
    fillColor: '#FFFF99',
    fillOpacity: 0.5,
    strokeWeight: 2,
    strokeColor: '#FF0000'
  }
};
function init() {
  var myOptions = {
    'zoom': 17,
    'center': new google.maps.LatLng(42.579693,-83.28072),
    'mapTypeId': google.maps.MapTypeId.ROADMAP,
    'draggableCursor': 'pointer', // every pixel is clickable.
    'streetViewControl': true //my favorite feature in V3!
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  var url = 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/BloomfieldHillsMichigan/Parcels/MapServer';
  svc = new gmaps.ags.MapService(url);
  var agsLayer = new gmaps.ags.MapOverlay(svc, {
    'opacity': 0.2
  });
  agsLayer.setMap(map);
  //map.overlayMapTypes.insertAt(0, agsType);
  google.maps.event.addListener(map, 'click', identify);
}
        
function identify(evt) {
  clearOverlays();
  if (res) 
    res.length = 0;
  svc.identify({
    'geometry': evt.latLng,
    'tolerance': 3,
    'layerIds': [0,2],
    'layerOption': 'all',
    'bounds': map.getBounds(),
    'width': map.getDiv().offsetWidth,
    'height': map.getDiv().offsetHeight,
    'overlayOptions': ovOptions
  }, function(results, err) {
    if (err) {
      alert(err.message + err.details.join('\n'));
    } else {
      addResultToMap(results, evt.latLng);
    }
  });
}

function clearOverlays() {
  if (ovs) {
    for (var i = 0; i < ovs.length; i++) {
      ovs[i].setMap(null);
    }
    ovs.length = 0;
  }
}

function addResultToMap(idresults, latlng) {
          res = idresults.results;
          layers = { "0": [], "2": []};
          for (var i = 0; i < res.length; i++) {
            var result = res[i];
            layers[result['layerId']].push(result);
          }
          // the following code based on ESRI sample
          // create and show the info-window with tabs, one for each map service layer
          var tabs = [];
          for (var layerId in layers) {
            var results = layers[layerId];
            var count = results.length;
            var label = "", content = "";
            switch(layerId) {
              case "0":
                label = "Building";
                content = "Total features returned: <b>" + count + "</b>";
                if (count == 0) break;
                content += "<table><tr><th>ID</th><th>Address</th></tr>";
                for (var j = 0; j < count; j++) {
                  var attributes = results[j].feature.attributes;
                  content += "<tr>";
                  content += "<td><a href='javascript:void(0)' onclick='showFeature(" + layerId + "," + j + ")'>" + attributes["PARCELID"]  + "</a></td>";
                  content += "<td>" + attributes["Full Site Address"]  + "</td>";
                  content += "</tr>";
                }
                content += "</table>";
                break;
              case "2":
                label = "Parcel";
                content = "Total features returned: <b>" + count + "</b>";
                if (count === 0) {
                  break;
                }
                content += "<table border='1'><tr><th>ID</th><th>Year Built</th><th>School District</th><th>Description</th></tr>";
                for (var j = 0; j < count; j++) {
                  var attributes = results[j].feature.attributes;
                  content += "<tr>";
                  content += "<td><a href='javascript:void(0)' onclick='showFeature(" + layerId + "," + j + ")'>" + attributes["Parcel Identification Number"]  + "</td>";
                   content+="<td>"+attributes['Residential Year Built']+"</td>";
                   content+="<td>"+attributes['School District Description']+"</td>";
                  content+="<td>"+attributes['Property Description']+"</td>";
                  content += "</tr>";
                }
                content += "</table>";
                break;
              
            }
            tabs.push({label:label, content:content});
            var container = document.createElement('div');
            container.style.width='450px';
            // =======START  TAB UI ================ 
            
            var tabBar = new goog.ui.TabBar();
            for (i = 0; i < tabs.length; i++) {
              var tab = new goog.ui.Tab(tabs[i].label);
              tab.content = tabs[i].content;
              tabBar.addChild(tab, true);
            }
            tabBar.render(container);
            goog.dom.appendChild(container, goog.dom.createDom('div', {
              'class': 'goog-tab-bar-clear'
            }));
            var contentDiv = goog.dom.createDom('div', {
              'class': 'goog-tab-content'
            });
            goog.dom.appendChild(container, contentDiv);
            
            goog.events.listen(tabBar, goog.ui.Component.EventType.SELECT, function(e) {
              contentDiv.innerHTML = e.target.content;
            });
            tabBar.setSelectedTabIndex(0);
            
            // =======END  TAB UI ================ 
            if (!iw) {
              iw = new google.maps.InfoWindow({
                content: container,
                position: latlng
              });
            } else {
              iw.setContent(container);
              iw.setPosition(latlng);
            }
            iw.open(map);
          }
        }
        
        function showFeature(layerId, index) {
          window.status = 'showFeature';
          clearOverlays();
          var idResult = layers[layerId][index];
          var f = idResult.feature;
          if (f.geometry) {
            for (var i = 0; i < f.geometry.length; i++) {
              ovs.push(f.geometry[i]);
              f.geometry[i].setMap(map);
            }
          }
        }
        
        window.onload = init;
        window['showFeature'] = showFeature;