
export var nameVertex = (vertex) => {
    return vertex['txDeviceID'] + '.' + vertex['txControlID'] + '->' + vertex['rxDeviceID'] + '.' + vertex['rxControlID'];
}

export var nameControl = (DeviceID, controlName) => {
  return DeviceID +  '.' + controlName;
}

export var getTxControlNameFromVertex = (vertex) => {
  return nameControl(vertex.txDeviceID, vertex.txControlID)
}

export var getRxControlNameFromVertex = (vertex) => {
  return nameControl(vertex.rxDeviceID, vertex.rxControlID)
}

export var joinAddress = (gateway, ip) => {
  return gateway.join('.') + '.' + ip.toString()
}

