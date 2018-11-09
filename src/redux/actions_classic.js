//Device
export const positionDevice = (deviceID, newPosition) => ({
  type: 'POSITION_DEVICE',
  deviceID,
  newPosition
})

export const sendPositionToServer = (deviceID, newPosition) => ({
  type: 'POSITION_DEVICE_SEND',
  deviceID,
  newPosition
})

export const updateVertex = () => ({
  type: 'UPDATE_VERTEX'
})

export const updateDragging = () => ({
  type: 'UPDATE_DRAGGING'
})

export const collapseDevice = (deviceID) => ({
  type: 'COLLAPSE_DEVICE',
  deviceID
})

//Icons
export const addIcon = (deviceID, icon) => ({
  type: 'ADD_ICON',
  deviceID,
  icon
})

//Control
export const updateControlValue = (deviceID, controlID, newValue) => ({
  type: 'UPDATE_CONTROL_VALUE',
  deviceID,
  controlID,
  newValue
})

//URL
export const storeURL = (url) => ({
  type: 'STORE_URL',
  url
})


//Vertex
export const addVertex = (rxDeviceID, rxControlID) => ({
  type: 'ADD_VERTEX',
  rxDeviceID,
  rxControlID
})

export const deleteVertex = (vertexID) => ({
  type: 'DELETE_VERTEX',
  vertexID
})

export const selectOutput = (txDeviceID, txControlID) => ({
  type: 'SELECT_OUTPUT',
  txDeviceID,
  txControlID
})

export const overwriteFromServer = (fromServer) => ({
  type: 'OVERWRITE_WITH_SERVER_DATA',
  fromServer
})

export const claimDevice = (deviceID) => ({
  type: 'CLAIM_DEVICE',
  deviceID
})

export const refreshFlowchart = () => ({
  type: 'REFRESH_FLOWCHART'
})

export const startLiveMode = () => ({
  type: 'START_LIVE_MODE'
})

export const stopLiveMode = () => ({
  type: 'STOP_LIVE_MODE'
})

export const setDetailsPanelDeviceID = (deviceID) => ({
  type: 'SET_DETAILS_DEVICE_ID',
  deviceID
})

export const sendWiFiCredentialsToDevice = (deviceID, placeKey) => ({
  type: 'SEND_WIFI_CRED_TO_DEVICE',
  deviceID,
  placeKey
})

export const hardRefresh = () => ({
  type: 'HARD_REFRESH_FLOWCHART'
})

export const searchForAccessPoints = () => ({
  type: 'SEARCH_FOR_ACCESS_POINTS'
})

export const setAccessPoints = (accessPoints) => ({
  type: 'SET_ACCESS_POINTS',
  accessPoints
})

export const connectToAccessPoint = (ssid) => ({
  type: 'CONNECT_TO_ACCESS_POINT',
  ssid
})

export const setAccessData = (packet) => ({
  type: 'SET_ACCESS_DATA',
  packet
})

export const resetDeviceAndOSWifi = (deviceID) => ({
  type: 'RESET_DEVICE_AND_OS_WIFI',
  deviceID
})

export const zoomIn = () => ({
  type: 'ZOOM_IN_FLOWCHART'
})

export const zoomOut = () => ({
  type: 'ZOOM_OUT_FLOWCHART'
})

export const resetDeviceWifi = (deviceID) => ({
  type: 'RESET_DEVICE_WIFI',
  deviceID
})

export const saveSnapshot = (name) => ({
  type: 'SAVE_SNAPSHOT',
  name
})

export const returnToSnapshot = (snapshotID) => ({
  type: 'RETURN_TO_SNAPSHOT',
  snapshotID
})

export const openSnapshotFile = (file) => ({
  type: 'OPEN_SNAPSHOT_UPLOAD',
  file
})

export const saveSnapshotUpload = (json) => ({
  type: 'SAVE_SNAPSHOT_UPLOAD',
  json
})

export const setSearchMode = (searchMode) => ({
  type: 'SET_SEARCH_MODE',
  searchMode
})

export const updateLockState = () => ({
  type: 'UPDATE_LOCK_STATE'
})

export const updateVertexVisibility = () => ({
  type: 'UPDATE_VERTEX_VISIBILITY'
})
