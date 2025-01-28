Module.register("MMM-MapTracker", {
  defaults: {
    googleMapsApiKey: "<API_KEY_HERE>", // Replace with your Google Maps API key
    zoom: 14,
    port: 8081, // Port for receiving fetch requests
  },

  start: function () {
    this.currentLocation = null;
    this.map = null;
    this.marker = null;

    // Load Google Maps JavaScript API
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key="+googleMapsApiKey;
    script.async = true;
    script.defer = true;
    script.onload = () => this.initializeMap();
    document.body.appendChild(script);

    // Start backend listener
    this.sendSocketNotification("START_LISTENER", this.config.port);
  },

  initializeMap: function () {
    this.map = new google.maps.Map(this.dom, {
      zoom: this.config.zoom,
      zoomControl:false,
      streetViewControl:false,
      scaleControl:false,
      rotateControl:false,
      panControl:false,
      mapTypeControl:false,
      fullscreenControl:false,
      center: { lat: 65.013325, lng: 25.464826 }, // Default center
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "LOCATION_UPDATE") {
      const { latitude, longitude } = payload;

      // Update map center
      const newLocation = new google.maps.LatLng(latitude, longitude);
      this.map.setCenter(newLocation);

      // Add or update marker
      if (this.marker) this.marker.setMap(null); // Remove old marker
      this.marker = new google.maps.Marker({
        position: newLocation,
        map: this.map,
        title: "Current Location",
      });
    }
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.style.width = "300px"; // muokkaa että voi muuttaa configissa
    wrapper.style.height = "400px";
    this.dom = wrapper;
    return wrapper;
  },
});
