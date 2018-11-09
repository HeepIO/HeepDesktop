
export const addDevice = (deviceID, device) => ({
  type: 'ADD_DEVICE',
  deviceID,
  device
})

export const addPlace = (placeID, place) => ({
  type: 'ADD_PLACE',
  placeID,
  place
})

export const addGroup = (groupID, group) => ({
  type: 'ADD_GROUP',
  group,
  groupID
})

export const logout = () => ({
	type: 'LOGOUT'
})

export const updateWebGLStatus = (status) => ({
	type: 'UPDATE_WEBGL_STATUS',
	status
})

export const updateLoginStatus = (status) => ({
	type: 'LOGIN_STATUS',
	status
})

export const loadLinkedAccount = (provider) => ({
	type: 'LOAD_PROVIDER',
	provider
})

export const unlinkAccount = (providerId) => ({
	type: 'UNLINK_PROVIDER',
	providerId
})

export const initPaperSignals = () => ({
	type: 'INIT_PAPER_SIGNALS'
})

export const addMemoryDump = (deviceID, controlID, MOP) => ({
	type: 'ADD_MEMORY_DUMP',
	deviceID,
	controlID,
	MOP
})

export const addMemoryDumpBatch = (deviceID, MOParray) => ({
	type: 'ADD_MEMORY_DUMP_BATCH',
	deviceID,
	MOParray
})

export const selectDeviceToDisplay = (deviceID) => ({
	type: 'SELECT_DEVICE_FOR_ANALYTICS',
	deviceID
})

export const saveNewPlace = (placeName, placeSSID, placeSSIDPassword) => ({
	type: 'SAVE_NEW_PLACE',
	placeName,
	placeSSID,
	placeSSIDPassword
})

export const deletePlaceFromAccount = (placeID) => ({
	type: 'DELETE_PLACE_FROM_FIREBASE',
	placeID
})

export const deletePlace = (placeID) => ({
	type: 'DELETE_PLACE',
	placeID
})

export const loginToFirebase = () => ({
	type: 'LOGIN_TO_FIREBASE'
})

export const logoutOfFirebase = () => ({
	type: 'LOGOUT_OF_FIREBASE'
})

export const addUser = (user) => ({
	type: 'ADD_USER',
	user
})
