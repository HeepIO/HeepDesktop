const os = require('os')
import * as HAPIParser from './HAPIMemoryParser'
import * as iconUtils from '../utilities/iconUtilities'
import * as generalUtils from '../utilities/generalUtilities'
import * as byteUtils from '../utilities/byteUtilities'
const dgram = require('dgram');
var log = require('electron-log');

const udpServer = dgram.createSocket('udp4');

const newMasterState = {
  devices: {},
  deviceWiFiCreds: {},
  positions: {},
  controls: {connections: {}},
  vertexList: {},
  icons: {},
  url: '',
  analytics: {}
};

var masterState = JSON.parse(JSON.stringify(newMasterState));

var heepPort = 5000;
var searchComplete = false;
var mostRecentSearch = {};

export var SearchForHeepDevices = (searchMode = 'broadcast', numTimesTried = 0, callback = () => {}) => {
  var gateway = findGateway();
  var searchBuffer = Buffer.from([0x09, 0x00])

  console.log(gateway);
  log.info('Searching for Devices on Gateway: ' + gateway);
  log.info('Search Mode: ' + searchMode);

  if (gateway != undefined) {
    callback(true);
    if (searchMode == 'broadcast') {
      PerformBroadcastSearch(gateway, searchBuffer);
    } else if (searchMode == 'unicast') {
      PerformUnicastSearch(gateway, searchBuffer);
    }
    

  } else {
    if (numTimesTried < 5) {
      setTimeout(() => SearchForHeepDevices(numTimesTried + 1, callback), 1000)
    }
  }
}

const PerformBroadcastSearch = (gateway, searchBuffer) => {

  var client = dgram.createSocket("udp4");
  client.bind(function(err, bytes){
    console.log("Set Broadcast");
    client.setBroadcast(true);
    const address = generalUtils.joinAddress(gateway,255)
    client.send(searchBuffer, 5000, address, function(err, bytes) {
        console.log("Broadcast sent");
        client.close();
    });
  });
}

const PerformUnicastSearch = (gateway, searchBuffer) => {
  console.log('Searching using Unicast Loop');
  for (var i = 0; i < 255; i++) {

    const client = dgram.createSocket("udp4");
    const IPAddress = generalUtils.joinAddress(gateway, i)
    // client.bind(function(err, bytes){
      client.send(searchBuffer, heepPort, IPAddress, (err) => {
        client.close();
      });
    // });
  }
}

export var GetCurrentMasterState = () => {
  return masterState
}

export var ResetMasterState = () => {

  masterState = JSON.parse(JSON.stringify(newMasterState));

  return masterState
}

export var ResetDevicesActiveStatus = () => {

  for (var deviceID in masterState.devices) {
    masterState.devices[deviceID].inactiveCount += 1
    if ( masterState.devices[deviceID].inactiveCount  > 2 ) {
      masterState.devices[deviceID].active = false
    }
  }

}

export var SendPositionToHeepDevice = (deviceID, position) => {

  SetDevicePositionFromBrowser(deviceID, position);

  var IPAddress = masterState.devices[deviceID].ipAddress;
  var xPosition = byteUtils.GetValueAsFixedSizeByteArray(position.left, 2);
  var yPosition = byteUtils.GetValueAsFixedSizeByteArray(position.top, 2);
  var packet = xPosition.concat(yPosition);
  var numBytes = [packet.length];

  var messageBuffer = Buffer.from([0x0B].concat(numBytes, packet));
  console.log('Connecting to Device ', deviceID + ' at IPAddress: ' + IPAddress);
  console.log('Data packet: ', messageBuffer);
  ConnectToHeepDevice(IPAddress, heepPort, messageBuffer)

}

export var sendWifiCredsToDevice = (deviceID, ssid, password) => {

  var IPAddress = masterState.devices[deviceID].ipAddress;
  var priority = byteUtils.GetValueAsFixedSizeByteArray(0, 1);
  var ssidByteArray = byteUtils.GetStringAsByteArray(ssid);
  var passwordByteArray = byteUtils.GetStringAsByteArray(password);
  var packet = priority.concat([ssidByteArray.length], ssidByteArray, [passwordByteArray.length], passwordByteArray);
  var numBytes = [packet.length];

  var messageBuffer = Buffer.from([0x22].concat(numBytes, packet));
  console.log('Connecting to Device ', deviceID + ' at IPAddress: ' + IPAddress);
  console.log('Data packet: ', messageBuffer);
  ConnectToHeepDevice(IPAddress, heepPort, messageBuffer)

}

export var sendResetNetworkToDevice = (deviceID) => {

  var IPAddress = masterState.devices[deviceID].ipAddress;
  
  var messageBuffer = Buffer.from([0x24, 0x00]);
  console.log('Connecting to Device ', deviceID + ' at IPAddress: ' + IPAddress);
  console.log('Data packet: ', messageBuffer);
  ConnectToHeepDevice(IPAddress, heepPort, messageBuffer)

}

export var SendValueToHeepDevice = (deviceID, controlID, newValue) => {
  if (CheckIfNewValueAndSet(deviceID, controlID, newValue)){
    var IPAddress = masterState.devices[deviceID].ipAddress;
    var controlByteArray = byteUtils.GetByteArrayFromValue(controlID);
    var valueByteArray = byteUtils.GetByteArrayFromValue(newValue);
    var numBytes = [controlByteArray.length + valueByteArray.length];
    var messageBuffer = Buffer.from([0x0A].concat(numBytes, controlByteArray, valueByteArray));
    console.log('Connecting to Device ', deviceID + ' at IPAddress: ' + IPAddress);
    console.log('Data Packet: ',  messageBuffer);
    ConnectToHeepDevice(IPAddress, heepPort, messageBuffer)
  }
}

export var SendVertexToHeepDevices = (vertex) => {
  console.log('Received the following vertex to send to HeepDevice: ', vertex)

  var IPAddress = masterState.devices[vertex.txDeviceID].ipAddress;
  AddVertex(vertex);
  var messageBuffer = PrepVertexForCOP(vertex, 0x0C);

  console.log('Connecting to Device ', vertex.txDeviceID + ' at IPAddress: ' + IPAddress);
  console.log('Data Packet: ',  messageBuffer);

  ConnectToHeepDevice(IPAddress, heepPort, messageBuffer)
}

export var SendDeleteVertexToHeepDevices = (vertex) => {
  console.log('Received the following vertex to delete from HeepDevice: ', vertex)

  var IPAddress = masterState.devices[vertex.txDeviceID].ipAddress;
  var messageBuffer = PrepVertexForCOP(vertex, 0x0D);
  DeleteVertex(vertex);

  console.log('Connecting to Device ', vertex.txDeviceID + ' at IPAddress: ' + IPAddress);
  console.log('Data Packet: ',  messageBuffer);

  ConnectToHeepDevice(IPAddress, heepPort, messageBuffer)
}

export var PrepVertexForCOP = (vertex, COP) => {
  var txDeviceID = byteUtils.GetDeviceIDAsByteArray(vertex.txDeviceID);
  var txControlID = byteUtils.GetValueAsFixedSizeByteArray(vertex.txControlID, 1);
  var rxDeviceID = byteUtils.GetDeviceIDAsByteArray(vertex.rxDeviceID);
  var rxControlID = byteUtils.GetValueAsFixedSizeByteArray(vertex.rxControlID, 1);
  var rxIP = byteUtils.ConvertIPAddressToByteArray(vertex.rxIP);
  var packet = txDeviceID.concat(rxDeviceID, txControlID, rxControlID, rxIP);
  var numBytes = [packet.length];

  return Buffer.from([COP].concat(numBytes, packet));
}

var CheckIfNewValueAndSet = (deviceID, controlID, newValue) => {
  var thisControl = generalUtils.nameControl(deviceID, controlID);
  if (masterState.controls[thisControl].CurCtrlValue == newValue){
    return false
  } else {
    masterState.controls[thisControl].CurCtrlValue = newValue;
    return true
  }
}

export var findGateway = () => {
  var networkInterfaces = os.networkInterfaces( );

  log.info('Found Interfaces: ' + networkInterfaces);

  for (var interfaces in networkInterfaces) {
    for (var i = 0; i < networkInterfaces[interfaces].length; i++ ) {
      // console.log(networkInterfaces[interfaces][i])
      if (networkInterfaces[interfaces][i].netmask == '255.255.255.0' ){
        var activeAddress = networkInterfaces[interfaces][i].address;
        var address = activeAddress.split('.');
        var myIp = address.pop();
        
        console.log('Searching on gateway: ', address);
        
        return address
      }
    }
  }
  
  console.log('Searching on gateway: ', address);
  return address
}

var ConnectToHeepDevice = (IPAddress, port, message) => {

  console.log(message);

  var client = dgram.createSocket('udp4');
  console.log("About to Send " + IPAddress);
  client.send(message, heepPort, IPAddress, (err) => {
    client.close();
  });
}

udpServer.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  ConsumeHeepResponse(msg, rinfo.address, rinfo.port);

  log.info(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

udpServer.on('listening', () => {
  const address = udpServer.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

console.log("About to bind");
udpServer.bind(heepPort);
console.log("Done binding");




var ConsumeHeepResponse = (data, IPAddress, port) => {
  // console.log('Device found at address: ', IPAddress + ':' + port.toString());
  // console.log('Stringified Data: ', data.toString());
  // console.log('Raw inbound Data: ', data);

  mostRecentSearch[IPAddress] = true;
  var HeepResponse = HAPIParser.ReadHeepResponse(data);

  if (HeepResponse != false){
    if (HeepResponse.op == 0x0F) {
      //Memory Dump
      AddMemoryChunksToMasterState(HeepResponse.memory, IPAddress, HeepResponse.deviceID);

    } else if ( HeepResponse.op == 0x10) {
      //Success
      console.log('Heep Device SUCCESS with a HAPI message: ', HeepResponse.message);

    } else if (HeepResponse.op == 0x11){
      //Error 
      console.log('Heep Device ERROR with an unHAPI message: ', HeepResponse.message);
    } else {
      console.error('Did not receive a known Response Code from Heep Device');
    }
  } else {
    console.error('Heep Response Invalid');
  }
}

var AddMemoryChunksToMasterState = (heepChunks, IPAddress, respondingDevice) => {
  // console.log(heepChunks);  

  for (var i = 0; i < heepChunks.length; i++) {

    try {
      if (heepChunks[i].op == 1){
        AddDevice(heepChunks[i], IPAddress);

      } else if (heepChunks[i].op == 2){
        AddControl(heepChunks[i]);

      } else if (heepChunks[i].op == 3){
        AddVertex(heepChunks[i].vertex)
        
      } else if (heepChunks[i].op == 4){
        SetIconFromID(heepChunks[i]);

      } else if (heepChunks[i].op == 5){
        SetCustomIcon(heepChunks[i]);
        
      } else if (heepChunks[i].op == 6){

        SetDeviceName(heepChunks[i])

      } else if (heepChunks[i].op == 7){

        SetDevicePosition(heepChunks[i])
        
      } else if (heepChunks[i].op == 31) {
        
        SetAnalyticsData(heepChunks[i])

      } else if (heepChunks[i].op == 32) {
        SetDeviceWiFi(heepChunks[i]);

      }
    } catch (err) {
      console.log(err.toString());
    }
    
  }

  CheckForVertexDeletions(heepChunks, respondingDevice)

}

var CheckForVertexDeletions = (heepChunks, respondingDevice) => {
  // Logic: 
  // Vertices are assumed to be saved onto the transmitting device. 
  // If a known vertex is not found in the memory dump response, timeSinceDiscovered is incremented on that vertex
  console.log('Entire MasterState VertexList: ', masterState.vertexList);

  Object.keys(masterState.vertexList).forEach((thisVertex) => {

    var foundVertices = [];

    if (masterState.vertexList[thisVertex].txDeviceID == respondingDevice) {
      
      heepChunks.forEach((thisChunk) => {
        if (thisChunk.op == 3) {
          foundVertices.push(generalUtils.nameVertex(thisChunk.vertex));
        }
      })


      if (foundVertices.includes(thisVertex)) {
        masterState.vertexList[thisVertex].timeSinceDiscovered = 0;
      } else {

        // If very old, just remove the vertex to keep managed state at a minimum
        if (masterState.vertexList[thisVertex].timeSinceDiscovered > 25) {
            delete masterState.vertexList[thisVertex]
        } else {
          masterState.vertexList[thisVertex].timeSinceDiscovered += 1;
        }
        
        
      }
    }
  })
}

var AddDevice = (heepChunk, IPAddress) => {
  var deviceID = heepChunk.deviceID;
  var deviceName = 'unset';
  var iconName = 'none';

  masterState.devices[deviceID] = {
    deviceID: deviceID,
    ipAddress: IPAddress,
    name: deviceName,
    active: true,
    inactiveCount: 0,
    iconName: "lightbulb",
    version: 0,
    inputs: [],
    outputs: []
  }

  SetNullPosition(deviceID);
  masterState.icons = iconUtils.GetIconContent();
}

var SetDeviceName = (heepChunk) => {
  masterState.devices[heepChunk.deviceID].name = heepChunk.deviceName;
  if ((heepChunk.deviceID in masterState.icons)){
    var currentIcon = masterState.icons[heepChunk.deviceID];
  } 
  else {
    var currentIcon = 'none';
  }
  iconUtils.SetDeviceIconFromString(heepChunk.deviceID, heepChunk.deviceName, currentIcon);
  masterState.icons = iconUtils.GetIconContent()
}

var AddControl = (heepChunk) => {
  // Transition this to use new ControlID throughout frontend 
  var tempCtrlName = generalUtils.nameControl(heepChunk.deviceID, heepChunk.control.controlID) 
  masterState.controls[tempCtrlName] = heepChunk.control;
  masterState.controls[tempCtrlName].deviceID = heepChunk.deviceID;

  masterState.controls.connections[tempCtrlName] = [];

  if (heepChunk.control.controlDirection == 0 && masterState.devices[heepChunk.deviceID].inputs.indexOf(tempCtrlName) < 0) {
      masterState.devices[heepChunk.deviceID].inputs.push(tempCtrlName);
  }

  if (heepChunk.control.controlDirection == 1 && masterState.devices[heepChunk.deviceID].outputs.indexOf(tempCtrlName) < 0) {
      masterState.devices[heepChunk.deviceID].outputs.push(tempCtrlName);
  }
      
}

var SetIconFromID = (heepChunk) => {
  var deviceName = masterState.devices[heepChunk.deviceID].deviceName;
  iconUtils.SetDeviceIconFromString(heepChunk.deviceID, deviceName, heepChunk.iconName);
  masterState.icons = iconUtils.GetIconContent()

  masterState.devices[heepChunk.deviceID].iconName = heepChunk.iconName;
}

var SetCustomIcon = (heepChunk) => {
  iconUtils.setCustomIcon(heepChunk.deviceID, heepChunk.iconData);
}

var SetNullPosition = (deviceID) => {
  
  var newPosition = {
    top: 0, left: 0
  }

  masterState.positions[deviceID] = newPosition;
}

var SetDevicePosition = (heepChunk) => {
  masterState.positions[heepChunk.deviceID] = heepChunk.position;
}

var SetDeviceWiFi = (heepChunk) => {

  if (masterState.deviceWiFiCreds[heepChunk.deviceID] == undefined) {
    masterState.deviceWiFiCreds[heepChunk.deviceID] = {};
  }
  
  masterState.deviceWiFiCreds[heepChunk.deviceID][heepChunk.SSID] = true;
  
}

var SetDevicePositionFromBrowser = (deviceID, position) => {
  var newPosition = {
    top: parseInt(position.top),
    left: parseInt(position.left)
  }

  masterState.positions[deviceID] = newPosition;
}

var AddVertex = (vertex) => {
  var vertexName = generalUtils.nameVertex(vertex);
  var txControl = generalUtils.getTxControlNameFromVertex(vertex);
  var rxControl = generalUtils.getRxControlNameFromVertex(vertex);
  masterState.vertexList[vertexName] = vertex;
  masterState.controls.connections[txControl].push(rxControl);

}

var DeleteVertex = (vertex) => {
  delete masterState.vertexList[generalUtils.nameVertex(vertex)];

  var txControl = generalUtils.getTxControlNameFromVertex(vertex);
  var rxControl = generalUtils.getRxControlNameFromVertex(vertex);
  var index = masterState.controls.connections[txControl].indexOf(rxControl)
  if ( index != -1) {
    masterState.controls.connections[txControl].splice(index, 1);
  }

}

var SetAnalyticsData = (heepChunk) => {

  if (masterState.analytics[heepChunk.deviceID] == undefined) {
    masterState.analytics[heepChunk.deviceID] = {};
  }

  masterState.analytics[heepChunk.deviceID][heepChunk.analytics.timeStamp] = heepChunk.analytics;
}

