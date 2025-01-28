const NodeHelper = require('node_helper');
const express = require('express');
const cors = require('cors');

module.exports = NodeHelper.create({
  start: function () {
    console.log("Starting node helper for MMM-MapTracker...");
    this.expressApp = null;
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "START_LISTENER") {
      this.startServer(payload); // Payload contains the port number
    }
  },

  startServer: function (port) {
    if (!this.expressApp) {
      this.expressApp = express();
      this.expressApp.use(cors()); // Enable CORS
      this.expressApp.use(express.json()); // Parse JSON requests

      // Endpoint to receive location updates
      this.expressApp.post('/location', (req, res) => {
        const { latitude, longitude } = req.body;

        if (latitude && longitude) {
          console.log(`Received location: Latitude=${latitude}, Longitude=${longitude}`);

          // Send location to frontend
          this.sendSocketNotification("LOCATION_UPDATE", { latitude, longitude });
          res.status(200).send('Location received successfully.');
        } else {
          res.status(400).send('Invalid location data.');
        }
      });

      // Start listening on the specified port
      this.expressApp.listen(port, () => {
        console.log(`MMM-MapTracker server is listening on port ${port}`);
      });
    }
  },
});
