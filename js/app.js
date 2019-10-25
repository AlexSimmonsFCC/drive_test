require(['esri/layers/VectorTileLayer',
        "esri/Map","esri/Graphic","esri/symbols/SimpleMarkerSymbol","esri/symbols/SimpleFillSymbol","esri/widgets/Legend","esri/tasks/Locator","esri/geometry/support/webMercatorUtils","esri/geometry/Point",
        "esri/views/MapView",
        "esri/layers/FeatureLayer","esri/widgets/Search", "esri/widgets/Home","esri/tasks/support/Query", "esri/tasks/QueryTask", "dojo/domReady!"], 
      
      function(VectorTileLayer, Map, Graphic, SimpleMarkerSymbol, SimpleFillSymbol, Legend, Locator, webMercatorUtils, Point, MapView, FeatureLayer, Search, Home, Query, QueryTask) {
        var map = new Map({
          basemap: "dark-gray"
        });

        var view = new MapView({
          container: "viewDiv",
          map: map,
          center: [-95.3, 38.397],
          zoom: 5
        });
        
         var home = new Home({
         view: view
          }, "HomeButton");
         view.ui.add(home, "top-left");

            
            // Instantiate Feature Layyer
            var vectorTileLayer = new VectorTileLayer({url:"https://tiles.arcgis.com/tiles/YnOQrIGdN9JGtBh4/arcgis/rest/services/RuralityTiersVTL/VectorTileServer"}); 
            var featureLayer = new FeatureLayer({url:"https://services.arcgis.com/YnOQrIGdN9JGtBh4/arcgis/rest/services/RuralityTiers_gdb/FeatureServer", outFields: ['*']});
            map.add(vectorTileLayer);
            map.add(featureLayer);
            

            
            
            
            // Create Legend
            var legend = new Legend({
            view: view,
            layerInfos:[
              {layer: featureLayer,
                title: ""}
            ]
            });
 

           // Add Search Bar and Legend
           view.ui.add(legend, "bottom-left");
           var search = new Search({container: "searchbar"});
     
           resultwindow.style.visibility='hidden' 
           
        // Outer Function to Add Point and Retrieve Rurality Tier from Search Bar
           search.on('search-complete', function(result){
           
            // Show Result Window
            resultwindow.style.visibility='visible'
              
            if(result.results && result.results.length > 0 && result.results[0].results && result.results[0].results.length > 0){
            var geom = result.results[0].results[0].feature.geometry;
            }        
            
            // Set Text if No Rural Tier
            document.getElementById("resultwindow").innerHTML = 'The address provided is not in a rural tier.';
            
            // Clear Point from Previous Query
            view.graphics.removeAll();
            
            // Construct Point Symbol and Add it When Search Completes
            var point = { type: "point",  longitude: geom.longitude, latitude: geom.latitude};
            var markerSymbol = { type: "simple-marker",  color: [226, 119, 40]};
            var pointGraphic = new Graphic({geometry: point, symbol: markerSymbol});
            view.graphics.add(pointGraphic);
            
            // Zoom to New Point
            view.goTo({center: [geom.longitude, geom.latitude], zoom: 10}, {animate: true, duration: 2000});
         
            // Query to Retrieve Rurality Tier.
            var query = featureLayer.createQuery();
            query.outFields = ["RuralType"];     
            query.geometry = geom  
            
            // Inner Function to Query the Layers and Set HTML Region with Result
            featureLayer.queryFeatures(query).then(function(response){
            var attribute = response.features[0].attributes;
            console.log(response)
            document.getElementById("resultwindow").innerHTML = "The address provided is located in a: " + "<span style='font-weight:bold; font-size:100%;' >"  + attribute["RuralType"] + " Tier" + "</span>";
            document.getElementById("info") = search;
             });

       }); 
         
     

     
     
     
     
     
      // Outer Function to Add Point and Retrieve Rurality Tier from Click Event
          view.on('click', function (event) {
          
          // Show Result Window
          resultwindow.style.visibility='visible'
          
          // Remove Graphics from Previous Click
           view.graphics.removeAll();
           
          // Set Text if No Rural Tier
          document.getElementById("resultwindow").innerHTML = 'The address provided is not in a rural tier.';
          
          // Get Coords on Mouse Click Location
           var clickcoords = view.toMap({x: event.x, y: event.y});
          
          // Construct Point Symbol and Add to Click Location
           var point = { type: "point",  longitude: clickcoords.longitude, latitude: clickcoords.latitude};
           var markerSymbol = { type: "simple-marker",  color: [226, 119, 40]};
           var pointGraphic = new Graphic({geometry: point, symbol: markerSymbol});
           view.graphics.add(pointGraphic)
         
          // Query to Retrieve Rurality Tier.
           var query = featureLayer.createQuery();
           query.outFields = ["RuralType"];     
           query.geometry = clickcoords  


          // Inner Function to Query the Layers, Get the Address, and Set HTML Region with Result
           featureLayer.queryFeatures(query).then(function(response){
           var attribute = response.features[0].attributes;
           var locator = new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
           locator.locationToAddress(webMercatorUtils.webMercatorToGeographic(event.mapPoint), 100).then(function(event){
            if (event.address) {
              var address = {Address: event.address};
              var location = webMercatorUtils.geographicToWebMercator(event.location)}
              document.getElementById("resultwindow").innerHTML = address["Address"] + 
              " is located in a: " + "<span style='font-weight:bold; font-size:100%;' >"  + attribute["RuralType"] + 
              " Tier" + "</span>"; 
              });
           document.getElementById("info") = search;
            });
            
       });
  });
