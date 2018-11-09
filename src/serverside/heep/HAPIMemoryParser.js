import * as byteUtils from '../utilities/byteUtilities.js'

export var ReadHeepResponse = (buffer) => {
  var it = 0;
  var packetBytes = ReadSizeOfPacket(buffer, it);
  var byteIndicatorBytes = packetBytes[1];

  var thisResponse = {
    op: buffer[0],
    deviceID: ReadDeviceID(buffer.slice(it + 1,it + 5)),
    packetBytes: packetBytes[0]
  };

  var dataPacket = buffer.slice(5 + byteIndicatorBytes);

  if (buffer[0] == 0x0F) {
    //Memory Dump
    thisResponse.memory = MemoryCrawler(dataPacket)

  } else if (buffer[0] == 0x10) {
    //Success, with optional text
    thisResponse.success = true;
    thisResponse.message = ReadAsText(dataPacket);

  } else if (buffer[0] == 0x11){
    //Error, with optional text
    thisResponse.success = false;
    thisResponse.message = ReadAsText(dataPacket);

  } else {
    return MemoryCrawler(buffer)
  }

  return thisResponse
}

export var ReadAsText = (buffer) => {
  return buffer.toString()
}


export var MemoryCrawler = (buffer) => {
  var it = 0;
  var data = [];

  while (it < buffer.length) {
    var nextBlock = GetNextBlock(buffer, it);

    if (nextBlock == false){
      console.log('Encountered an un-implemented OP Code');

    } else {
      //console.log('nextBlock: ', nextBlock);
    }

    it = nextBlock[0];
    data.push(nextBlock[1]);
  }
  return data
}

var GetNextBlock = (buffer, it) => {
  var packetBytes = ReadSizeOfPacket(buffer, it);
  var byteIndicatorBytes = packetBytes[1];
  var thisBlock = {
    op: buffer[it],
    deviceID: ReadDeviceID(buffer.slice(it + 1,it + 5)),
    packetBytes: packetBytes[0]
  };


  console.log('Encountered OP: ', buffer[it]);

  it += 5;
  var thisBlockData = buffer.slice(it, it + buffer[it] + 1);

  if (thisBlock.op == 0x01){
    // Device Data
    thisBlock.version = ReadFirmwareVersion(thisBlockData);

  } else if (thisBlock.op == 0x02) {
    // Controls
    thisBlock.control = ReadControl(thisBlockData);

  } else if (thisBlock.op == 0x03) {
    // Vertex
    thisBlock.vertex = ReadVertex(thisBlockData);
    thisBlock.vertex.txDeviceID = thisBlock.deviceID;

  } else if (thisBlock.op == 0x04) {
    // Icon ID
    thisBlock.iconName = ReadIconID(thisBlockData);

  } else if (thisBlock.op == 0x05) {
    //Custom Icon Drawing
    thisBlock.iconData = ReadIconCustom(thisBlockData);

  } else if (thisBlock.op == 0x06) {
    //Device Name
    thisBlock.deviceName = ReadDeviceName(thisBlockData);

  } else if (thisBlock.op == 0x07) {
    //FrontEnd Position
    thisBlock.position = ReadPosition(thisBlockData);

  } else if (thisBlock.op == 0x08) {
    //DeviceIP

  } else if (thisBlock.op == 0x12) {
    //Fragment

  } else if (thisBlock.op == 0x1F) {
    //Analytics
    thisBlock.analytics = ReadAnalyticsData(thisBlockData);

  } else if (thisBlock.op == 0x20) {
    //WiFi SSID
    thisBlock.SSID = ReadWiFiSSID(thisBlockData);

  } else {

  }

  it += CalculateNextIterator(byteIndicatorBytes, thisBlock.packetBytes);
  return [it, thisBlock]
}

export var ReadDeviceID = (buffer) => {
  var asHexString = byteUtils.ByteArrayToHexString(buffer);

  return asHexString

}

var ReadSizeOfPacket = (buffer, it) => {
  // Need to implement expansion logic for values > 255
  // Currently assume < 255
  return [buffer[it + 5], 1]
}

var CalculateNextIterator = (indicator, bytes) => {
  return bytes + indicator
}

export var ReadFirmwareVersion = (thisBlockData) => { // OP 1
  return thisBlockData[1]
}

export var ReadControl = (thisBlockData) => { // OP 2

  var thisControl = {
    controlID: thisBlockData[1],
    controlType: thisBlockData[2],
    controlDirection: thisBlockData[3],
    valueLow: thisBlockData[4],
    valueHigh: thisBlockData[5],
    valueCurrent: thisBlockData[6],
    controlName: thisBlockData.slice(7).toString('ascii')
  }

  return thisControl
}

 export var ReadPosition = (thisBlockData) => {
  var thisPosition = {
    left: 0,
    top: 0
  }

  thisPosition.left = ((thisBlockData[1] << 8) >>> 0) + thisBlockData[2];
  thisPosition.top = ((thisBlockData[3] << 8) >>> 0) + thisBlockData[4];

  if (thisPosition.left < 0 || thisPosition.left > 2000) {
    thisPosition.left = 100;
  }

  if (thisPosition.top < 0 || thisPosition.top > 2000) {
    thisPosition.top = 100;
  }

  return thisPosition
 }

 export var ReadDeviceName = (thisBlockData) => {
  return thisBlockData.slice(1).toString('ascii')
 }

 export var ReadIconID = (thisBlockData) => {
  var iconName = 'none';
  if (thisBlockData[1] == 1){
    iconName = 'lightbulb';
  } else if (thisBlockData[1] == 2) {
    iconName = 'lightswitch';
  } else if (thisBlockData[1] == 3) {
    iconName = 'outlet';
  } else if (thisBlockData[1] == 4) {
    iconName = 'powerButton';
  } else if (thisBlockData[1] == 5) {
    iconName = 'cuckooClock';
  } else if (thisBlockData[1] == 6) {
    iconName = 'maglock';
  } else if (thisBlockData[1] == 7) {
    iconName = 'rfid';
  } else if (thisBlockData[1] == 8) {
    iconName = 'motor';
  } else if (thisBlockData[1] == 9) {
    iconName = 'button';
  } else if (thisBlockData[1] == 10) {
    iconName = 'climate';
  } else if (thisBlockData[1] == 11) {
    iconName = 'servo';
  } else if (thisBlockData[1] == 12) {
    iconName = 'soilSensor';
  } else if (thisBlockData[1] == 13) {
    iconName = 'speakers';
  } else if (thisBlockData[1] == 14) {
    iconName = 'rotary';
  } else if (thisBlockData[1] == 15) {
    iconName = 'openClose';
  } else if (thisBlockData[1] == 16) {
    iconName = 'PIRSensor';
  }

  return iconName;
 }

 export var ReadIconCustom = (thisBlockData) => {
  return thisBlockData.slice(1).toString('ascii');
 }

 export var ReadVertex = (thisBlockData) => {

  console.log("VERTEX: ", thisBlockData);

  var thisVertex = {
    rxDeviceID: ReadDeviceID(thisBlockData.slice(1, 5)),
    txControlID: thisBlockData[5],
    rxControlID: thisBlockData[6],
    rxIP: thisBlockData.slice(7).join('.'),
    timeSinceDiscovered: 0
  };

  return thisVertex
 }


 var ReadAnalyticsData = (thisBlockData) => {

  var date = new Date(Date.UTC(2018, 0, 1, 0, 0, 0));
  var controlValNumBytes = thisBlockData[2];
  var controlValBytes = thisBlockData.slice(3, 3 + controlValNumBytes);
  var controlValue = byteUtils.GetIntFromByteArray(controlValBytes);
  var timeStampNumBytes = thisBlockData[3 + controlValNumBytes + 1];
  const timeStampBytes = thisBlockData.slice(3 + controlValNumBytes + 2);
  var timeInMillis = byteUtils.GetIntFromByteArray(timeStampBytes);
  var timestampMillis = date.getTime() + timeInMillis;
  var timestamp = new Date(timestampMillis);

  var thisAnalytics = {
    controlID: thisBlockData[1],
    controlValue: controlValue,
    timeStamp: timestamp
  }

  return thisAnalytics
 }

const ReadWiFiSSID = (thisBlockData) => {
  return thisBlockData.slice(1).toString('ascii')
}
