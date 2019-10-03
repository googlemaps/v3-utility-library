var dynamap;
        var dynamap2;
        var map;
        
        function init() {
          var myOptions = {
            zoom: 6,
            center: new google.maps.LatLng(38, -98),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: true
          };
          map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
          var url = 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Demographics/ESRI_Census_USA/MapServer';
          dynamap = new gmaps.ags.MapOverlay(url);
          // set definition after map service load event.
          google.maps.event.addListenerOnce(dynamap.getMapService(), 'load', function(){
          var service = dynamap.getMapService();
            service.getLayer("Coarse Counties").definition = "STATE_NAME='Kansas' and POP2007>25000";
            service.getLayer("Detailed Counties").definition = "STATE_NAME='Kansas' and POP2007>25000";
            service.getLayer("states").definition = "STATE_NAME='Kansas'";
            dynamap.setMap(map);
          });
          
          // set definitions in constructor, hard coded layer ids.
          dynamap2 = new gmaps.ags.MapOverlay(url, {
            exportOptions: {
              layerIds:[5,4,3],
              layerOption: 'show',
              layerDefinitions: {
                '5': "STATE_NAME='New Mexico'",
                '4': "STATE_NAME='New Mexico' and POP2007>25000",
                '3': "STATE_NAME='New Mexico' and POP2007>25000"
              }
            }
          });
          dynamap2.setMap(map);
          
        }
        window.onload=init;