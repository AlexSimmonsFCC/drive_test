require([
  'esri/Map',
  'esri/views/MapView',
  'esri/Basemap',
  'esri/layers/VectorTileLayer',
  'esri/layers/FeatureLayer',
  'esri/layers/WebTileLayer',
  'esri/widgets/Search',
  'esri/widgets/Home',
  'esri/widgets/Locate',
  'dojo/domReady!'
],
    function (Map, MapView, Basemap, VectorTileLayer, FeatureLayer, WebTileLayer, Search, Home, Locate) {
      var map, view, searchWidget, homeBtn, locateBtn
      var layers = window.layers
      var featLayers = []

        // Create base layer from Mapbox street layer
      var mapBaseLayer = new WebTileLayer({
        urlTemplate: 'https://{subDomain}.tiles.mapbox.com/v4/fcc.k74ed5ge/{level}/{col}/{row}.png?access_token=pk.eyJ1IjoiZmNjIiwiYSI6InBiaGMyLU0ifQ.LOmVYpUCFv2yWpbvxDdQNg',
        subDomains: ['a', 'b', 'c', 'd'],
        copyright: '\u00A9 OpenStreetMap contributors Design \u00A9 Mapbox'
      })

        // Create base map from Mapbox layer
      var mapBox = new Basemap({
        baseLayers: [mapBaseLayer],
        title: 'Street'
      })

        // Create map
      map = new Map({
        basemap: mapBox
      })

        // Make map view and bind it to the map
      view = new MapView({
        container: 'map',
        map: map,
        center: [-98, 38.48],
        zoom: 4,
        constraints: {
          minZoom: 4,
          maxZoom: 9,
          rotationEnabled: false
        }
      })

        // Add search widget
      searchWidget = new Search({
        view: view
      })

        // Position search widget
      view.ui.add(searchWidget, {
        position: 'top-right',
        index: 2
      })

        // Add Home widget
      homeBtn = new Home({
        view: view
      })

        // Position Home widget
      view.ui.add(homeBtn, 'top-left')

        // Add locate widget
      locateBtn = new Locate({
        view: view
      })

        // Position locate widget
      view.ui.add(locateBtn, {
        position: 'top-left'
      })

      // Add Info Region
      view.ui.add("info", "top-right");

      var template = {
        title: '{Tour} Stop Details',
        content: '<ul style="margin-top: 0"><li>City = {City}</li><li>State = {State}</li><li><a href={Link}>Link</a></li><li><img src="{Details}" alt=""></li><ul>'
      }

      // Create feature layers
      var fLayerStates = new FeatureLayer({
        url: 'https://services.arcgis.com/YnOQrIGdN9JGtBh4/ArcGIS/rest/services/VisitedStates/FeatureServer/0?token=YAnkkFUvC7X-oa3y_GLl4Vvu6mzao5h6dEXg0VJ9WiauySlP1DbLm4YVvqRS4SJiMgDqkE8ZGSq5OfkSKPb8S6JG9jSNhKMgT725KY2DwlYlFBKmG6-_ntfEKM6TOt4uHMFrqSO0POPxZX5MePGDR-S2fXU2i8r6Hu1WbiYM_rncZpQKKjwTuih7_A_S3WNFTm-HdgC-3IYpAbfyfq76ZoBoby6ZK3NWTyOomCQI_wAMycVQWQ0tKbZL-RSyObIMKdo9uXL09b2j9mSVRywZxQ..',
        outFields: ['*']
      })

      var fLayerStops = new FeatureLayer({
        url: 'https://services.arcgis.com/YnOQrIGdN9JGtBh4/ArcGIS/rest/services/TourStops/FeatureServer/0?token=jJw0ErN_O-9fblQXCD2vnHoyJ02VQMSEoQ1lP-fjl62jSYl2RwiQ00CFVw9t9_iCAXOqttTkk9IFJr8KXJa8DRAu-zoVL0DATc_KQwSCPVE5s07-EuvhVuRXCAmhuN9hQus-HQGuzXRyOWRxLc6KuwNA5O6ex6yTDDx3J3p2HEdmLBv0i7FW7CS9zjD6o4b06p1FrXabjRTGcXZy6AGYJcI4lNRawkBa_dvuYvwJNqh_pTOx7vtvazDgPyvfzqyePHQ1I0A3VkchKO9mqsWuHw..',
        outFields: ['*']
      })

      var fLayerLines = new FeatureLayer({
        url: 'https://services.arcgis.com/YnOQrIGdN9JGtBh4/ArcGIS/rest/services/TripLines/FeatureServer/0?token=3rFkNxQ1qHMoSKDAfMVKEVzTN3R7AYu7ysXoSsTqcsokIdJUk894pTtap6hqHQ0Jsvojd5Ishiwxf6-u1l9coI4XSoZ_y7RUsjVP7t1BIS-7JJ4d20aOPhwaC9jhsUQV11MN3ZcJZA0PSVe-pWOycTQ0srCCeeITlva9smWOuOdMNPb4fRiAKL2HjqG93LSrQuGXrFGIw1aCIlfFX8eP3f1EuNhOirzsYQUCSCv_1HYZpyFN3PtM6yzBxR67mVPknJdi8p1p_K2T87xfPnCP3A..',
        outFields: ['*']
      })

      //Pointer Event Handler
      view.on("pointer-move", eventHandler);
      view.on("pointer-down", eventHandler);

      //Hit Test Check
      function eventHandler(event) {
        view.hitTest(event)
          .then(getGraphics);
      }
   
      function getGraphics(response) {
        if (response.results.length) {
          var graphic = response.results.filter(function(result) {
            return result.graphic.layer === fLayerStops;
          }}}[0].graphic;

          var attributes = graphic.attributes;
          var state = attributes.state;
          var city = attributes.city;
          
          document.getElementById("info").style.visibility = "visible";
          document.getElementById("state").innerHTML = "State: " + state;
          document.getElementById("city").innerHTML = "City: " + category;
     


        // Add tile layers to map
      map.addMany([fLayerStates,fLayerStops,fLayerLines])
     
        
      $('#btn-closeLegend').on('click', function (e) {
        e.preventDefault()
        $('.map-legend').hide('fast')
      })

      $('#btn-openLegend').on('click', function (e) {
        e.preventDefault()
        $('.map-legend').show('fast')
      })

        // toggle layer control display
      $('#btn-closeLayerCtrl').on('click', function (e) {
        e.preventDefault()
        $('.layer-control').hide('fast')
      })

      $('#btn-openLayerCtrl').on('click', function (e) {
        e.preventDefault()
        $('.layer-control').show('fast')
      })
    }}})
