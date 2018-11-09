const path = require('path')
const url = require('url')
var log = require('electron-log');
var expressStaticGzip = require("express-static-gzip");

const express = require('express');
const bodyParser = require('body-parser');
const heepConnect = require('./serverside/heep/HeepConnections');
const heepAccess = require('./serverside/heep/HeepAccessPoints');
const simulationDevice =  require('./serverside/simulationHeepDevice.js');

var app = express();

app.set('port', (process.env.PORT || 3004));

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);

app.use('/src', (req, res, next) => {
  const oneYear = 365 * 24 * 60 * 60;
  res.setHeader('Cache-Control', 'max-age=' + oneYear + ', immutable');
  next();
});

app.use('/', expressStaticGzip(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/findDevices', function(req, res) {
  let simulation = false;

  if (simulation) {
    res.json(simulationDevice.simulationDevice);
  } else {
    heepConnect.SearchForHeepDevices(req.body.searchMode);
    res.json(heepConnect.GetCurrentMasterState());
  }

});

app.get('/api/searchForAccessPoints', (req, res) => {
  console.log("Search for Access Points")

  heepAccess.QueryAvailableAccessPoints((results) => {
    res.json(results);
  });

})

app.get('/api/ResetSystemWifi', (req, res) => {
  console.log("Resetting Wifi")

  heepAccess.ResetSystemWifi((results) => {
    res.json(results);
  });

})

app.post('/api/resetDeviceAndOSWifi', (req, res) => {
  console.log("Resetting Wifi")

  heepConnect.sendResetNetworkToDevice(req.body.deviceID)

  setTimeout( () => { // Wait 1 second for the device to respond to the Reset COP

    heepAccess.ResetSystemWifi((results) => {
      console.log(results)

      setTimeout(() => hardResetState(req, res), 1000); //wait 1 second after wifi reset to start trying to get the new state
    });
  }, 1000);

})

app.post('/api/resetDeviceWifi', (req, res) => {
  console.log("Resetting Device Wifi")

  heepConnect.sendResetNetworkToDevice(req.body.deviceID)

  res.end('Sent COP to device');

})

app.post('/api/refreshLocalDeviceState', (req, res) => {
  console.log("Refreshing local device state")
  heepConnect.ResetDevicesActiveStatus();
  heepConnect.SearchForHeepDevices(req.body.searchMode);

  setTimeout(() => {
    res.json(heepConnect.GetCurrentMasterState());
  }, 2000);

})

app.post('/api/hardRefreshLocalDeviceState', (req, res) => {
  hardResetState(req, res);
})

const hardResetState = (req, res, timeout = 2000) => {
  console.log("Refreshing local device state")
  heepConnect.ResetMasterState();
  heepConnect.SearchForHeepDevices(req.body.searchMode, 0, (success) => {
    console.log('Found Gateway, waiting ' + timeout + 'ms to reset state');
    setTimeout(() => {
      res.json(heepConnect.GetCurrentMasterState());
    }, timeout);

  });



}

app.post('/api/setValue', function(req, res) {

  heepConnect.SendValueToHeepDevice(req.body.deviceID, req.body.controlID, req.body.value);

  res.end("Value sent to Heep Device");
});

app.post('/api/setVertex', function (req, res) {
  console.log(req.body.vertex)

  heepConnect.SendVertexToHeepDevices(req.body.vertex);

  res.end("Sending Vertex to Heep Devices");
});

app.post('/api/deleteVertex', function(req, res) {
  console.log(req.body.vertex)

  heepConnect.SendDeleteVertexToHeepDevices(req.body.vertex);

  res.end("Deleting Vertex on Heep Devices");
});

app.post('/api/setPosition', function(req, res) {

  heepConnect.SendPositionToHeepDevice(req.body.deviceID, req.body.position);

  res.end("Device Position has been updated");
});

app.post('/api/sendWifiCredsToDevice', function(req, res) {

  heepConnect.sendWifiCredsToDevice(req.body.deviceID, req.body.ssid, req.body.password);
  console.log("Sending Wifi Credentials to the Device: " + req.body.deviceID)
  res.end("Sending Wifi Credentials to the Device: " + req.body.deviceID);
});

app.post('/api/connectToAccessPoint', function(req, res) {
  console.log("Connect To Access Point: ", req.body.ssid)

  connectToAccessPoint(req, res, (response) => {
    console.log('First connection succeeded')
    hardResetAP(res, req, response.success);

  }, () => {

    console.log('First connection failed. Trying to connect a second time');

    connectToAccessPoint(req, res, (response) => {
      hardResetAP(res, req, response.success);
    }, (response) => {

      res.json({
        success: response.success,
        ssid: req.body.ssid,
        data: heepConnect.GetCurrentMasterState()
      })
    });
  });

})

const connectToAccessPoint = function(req, res, successCallback, failureCallback) {

  heepAccess.ConnectToAccessPoint(req.body.ssid, 'HeepSecretPassword', (response) => {
    //Perform a hard reset and send results back to UI - should only see 1 device
    if ( response.success ) {
      successCallback(response);
    } else {
      failureCallback(response)
    }

  });
}

const hardResetAP = function(res, req, success = true) {

  heepConnect.ResetMasterState();
  heepConnect.SearchForHeepDevices(req.body.searchMode);
  setTimeout(() => {
    res.json({
      success: success,
      ssid: req.body.ssid,
      data: heepConnect.GetCurrentMasterState()
    });
  }, 2000);
}

app.listen(app.get('port'), function(error) {

  if (error) {
    console.error(error)
  } else {

    log.info('Hello, log');
    log.info('Server started: http://localhost:' + app.get('port') + '/');
  }
});
