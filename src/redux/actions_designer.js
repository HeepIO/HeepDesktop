export const updateNumControls = (num) => ({
	type: 'UPDATE_NUM_CONTROLS',
	num
})

export const updateDeviceName = (name) => ({
	type: 'UPDATE_DEVICE_NAME',
	name
})

export const updateSystemType = (system) => ({
	type: 'UPDATE_SYSTEM_TYPE',
	system
})

export const updateApplicationName = (applicationName) => ({
	type: 'UPDATE_APPLICATION_NAME',
	applicationName
})

export const updateControlName = (controlID, name) => ({
	type: 'UPDATE_CONTROL_NAME',
	controlID, 
	name
})

export const updateControlDirection = (controlID, direction) => ({
	type: 'UPDATE_CONTROL_DIRECTION',
	controlID, 
	direction
})

export const updateControlType = (controlID, controlType) => ({
	type: 'UPDATE_CONTROL_TYPE',
	controlID, 
	controlType
})

export const packageSourceFiles = () => ({
	type: 'PACKAGE_SOURCE_FILES'
})

export const updateControlMax = (controlID, controlMax) => ({
	type: 'UPDATE_CONTROL_MAX',
	controlID, 
	controlMax
})

export const updateControlMin = (controlID, controlMin) => ({
	type: 'UPDATE_CONTROL_MIN',
	controlID, 
	controlMin
})

export const addNewControl = (controlConfig) => ({
	type: 'ADD_NEW_CONTROL',
	controlConfig
})

export const updatePhysicalLayer = (physicalLayer) => ({
	type: 'UPDATE_PHYSICAL_LAYER',
	physicalLayer
})

export const updateSSID = (ssid) => ({
	type: 'UPDATE_SSID',
	ssid
})

export const updateSSIDPassword = (ssidPassword) => ({
	type: 'UPDATE_SSID_PASSWORD',
	ssidPassword
})

export const updateControlPin = (controlID, pinNumber) => ({
	type: 'UPDATE_CONTROL_PIN',
	controlID,
	pinNumber
})

export const updateControlPinPolarity = (controlID, polarity) => ({
	type: 'UPDATE_CONTROL_PIN_POLARITY',
	controlID,
	polarity
})

export const updateControlAnalogOrDigital = (controlID, analogOrDigital) => ({
	type: 'UPDATE_CONTROL_ANALOG_DIGITAL',
	controlID,
	analogOrDigital
})

export const selectIcon = (iconID) => ({
	type: 'SELECT_ICON',
	iconID
})

export const closeIconModal = () => ({
	type: 'CLOSE_ICON_MODAL'
})

export const openIconModal = () => ({
	type: 'OPEN_ICON_MODAL'
})

export const deleteControl = (controlID) => ({
	type: 'DELETE_CONTROL',
	controlID
})

export const selectPlace = (placeID) => ({
	type: 'SELECT_PLACE',
	placeID
})
