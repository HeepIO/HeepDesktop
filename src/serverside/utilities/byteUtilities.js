
export var ConvertIPAddressToByteArray = (stringIP) => {
  var split = stringIP.split('.');
  var byteArray = [];
  for (var i = 0; i < split.length; i++){
    byteArray.push(parseInt(split[i]));
  }

  return byteArray
}

export var GetDeviceIDAsByteArray = (value) => {
  var deviceIDbuf = Buffer.from(value, 'hex'); 
  var deviceID = [...deviceIDbuf];
  return deviceID
}

export var GetValueAsFixedSizeByteArray = (value, size) => {
  var valueBytes = GetByteArrayFromValue(value, size);
  var backfill = size - valueBytes.length;
  for (var i = 0; i < backfill; i++){
    valueBytes.unshift(0x00);
  }
  
  return valueBytes
}

export var GetStringAsByteArray = (str) => {
  console.log('STRING: ', str);
  var myBuffer = [];
  var buffer = new Buffer(str, 'utf-8');
  for (var i = 0; i < buffer.length; i++) {
      myBuffer.push(buffer[i]);
  }

  console.log(myBuffer);

  return myBuffer
}

export var GetByteArrayFromValue = (value, numBytes = GetNecessaryBytes(value)) => {
  var byteArray = [];

  for (var i = 0; i < numBytes; i++){ 
    var hexVal = value % 256;
    byteArray.unshift(hexVal);
    value = value >> 8;
  }

  return byteArray
}

export var GetNecessaryBytes = (value) => {
  var numBytes = 1;
  value = value >> 8;

  while (value > 0) {
    numBytes += 1;
    value = value >> 8;
  }

  return numBytes
}


export var GetIntFromByteArray = (buffer) => {
  
  var integer = 0;

  for (var i = 0; i < buffer.length; i++) {
    integer += (buffer[buffer.length - i - 1] <<  8*i) >>> 0;
  }

  return integer
}

export const ByteArrayToBase64String = (arrayBuffer) => {
  let base64String = new Buffer(arrayBuffer).toString('base64');
  return base64String
}

export const ByteArrayToHexString = (arrayBuffer) => {
  let hexString = new Buffer(arrayBuffer).toString('hex');
  return hexString
}
