import { combineReducers } from 'redux'
import Immutable from 'immutable'
import { initialState } from '../index'
import { packageSourceFiles } from '../HeepDesigner/packageSourceFiles'
import { sys_phy_files } from '../HeepDesigner/SystemPHYCompatibilities'

export default function(state = initialState.builder, action, fullState = initialState) {

  switch (action.type) {
    case 'UPDATE_DEVICE_NAME' :

        return Immutable.Map(state).set('deviceName', action.name).toJS()

    case 'UPDATE_NUM_CONTROLS' :

      var controls = Immutable.Map(state.controls).toJS();

      if (controls.length < action.num) {
        for (var i = controls.length; i < action.num; i++) {
          controls.push(initialControlState(i));
        }
      }

      var newMaster = Immutable.Map(state)
      .set('numControls', action.num)
      .set('controls', controls)
      .toJS()

        return newMaster

    case 'UPDATE_SYSTEM_TYPE' :

      return Immutable.Map(state)
        .set('systemType', action.system)
        .set('physicalLayer', Object.keys(sys_phy_files[action.system])[0])
        .toJS()

    case 'UPDATE_APPLICATION_NAME' :

      return Immutable.Map(state).set('applicationName', action.applicationName).toJS()

    case 'UPDATE_CONTROL_NAME' :

      var controlID = action.controlID;

      var newState = Immutable.Map(state.controls).toJS();
      newState[controlID]['controlName'] = action.name;

      return Immutable.Map(state).set('controls', newState).toJS()

    case 'UPDATE_CONTROL_DIRECTION' :

    var controlID = action.controlID;


      var newState = Immutable.Map(state.controls).toJS();
      newState[controlID]['controlDirection'] = action.direction;

      console.log('NEW: ', newState)

      return Immutable.Map(state).set('controls', newState).toJS()

    case 'UPDATE_CONTROL_TYPE' :

      var newState = Immutable.Map(state.controls).toJS();

      newState[action.controlID]['controlType'] = action.controlType;

      return Immutable.Map(state).set('controls', newState).toJS()

    case 'PACKAGE_SOURCE_FILES' :

      console.log('PACKAGE SOURCE');

      var deviceDetails = Immutable.Map(state).delete("controls").toJS();

      var currentControls = Immutable.Map(state.controls).toJS();

      for (var index in Object.keys(currentControls)) {
        currentControls[Object.keys(currentControls)[index]].controlID = parseInt(index)
      }
      
      packageSourceFiles(deviceDetails, currentControls);

      return state

    case 'UPDATE_CONTROL_MAX' :

      var newState = Immutable.Map(state.controls).toJS();
      newState[action.controlID]['highValue'] = parseInteger(action.controlMax);

      return Immutable.Map(state).set('controls', newState).toJS()

    case 'UPDATE_CONTROL_MIN' :

      var newState = Immutable.Map(state.controls).toJS();
      newState[action.controlID]['lowValue'] = parseInteger(action.controlMin);

      return Immutable.Map(state).set('controls', newState).toJS()

    case 'ADD_NEW_CONTROL' :

        if(action.controlConfig == "Select...")
          return state;
        
        const controlKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        var controls = Immutable.Map(state.controls).set(controlKey, initialControlState(Object.keys(state.controls).length)).toJS();

        controls[controlKey].designerControlType = action.controlConfig;

        var newMaster = Immutable.Map(state)
        .set('numControls', state.numControls + 1)
        .set('controls', controls)
        .toJS()

        return newMaster

    case 'UPDATE_PHYSICAL_LAYER' : 

        return Immutable.Map(state).set('physicalLayer', action.physicalLayer).toJS()

    case 'UPDATE_SSID' : 

        return Immutable.Map(state).set('ssid', action.ssid).toJS()

    case 'UPDATE_SSID_PASSWORD' :
        
        return Immutable.Map(state).set('ssidPassword', action.ssidPassword).toJS()

    case 'UPDATE_CONTROL_PIN' :

        var newState = Immutable.Map(state.controls).toJS();
        newState[action.controlID]['pinNumber'] = parseInteger(action.pinNumber);

        return Immutable.Map(state).set('controls', newState).toJS()

    case 'UPDATE_CONTROL_PIN_POLARITY' :

        var newState = Immutable.Map(state.controls).toJS();
        newState[action.controlID]['pinNegativeLogic'] = action.polarity;

        return Immutable.Map(state).set('controls', newState).toJS()

    case 'UPDATE_CONTROL_ANALOG_DIGITAL' :

        var newState = Immutable.Map(state.controls).toJS();
        newState[action.controlID]['analogOrDigital'] = action.analogOrDigital;

        return Immutable.Map(state).set('controls', newState).toJS()

    case 'SELECT_ICON' :

        return Immutable.Map(state).set('iconSelected', parseInt(action.iconID)).toJS();

    case 'CLOSE_ICON_MODAL': 
    
        return Immutable.Map(state).set('selectingIcon', false).toJS();

    case 'OPEN_ICON_MODAL': 
        return Immutable.Map(state).set('selectingIcon', true).toJS();

    case 'DELETE_CONTROL' :

      const newState = Immutable.Map(state.controls).delete(action.controlID).toJS();

      return Immutable.Map(state).set('controls', newState).toJS();

    case 'SELECT_PLACE' :

      const newSSID = fullState.places[action.placeID] ? fullState.places[action.placeID].networks.wifi.ssid : ''
      const newPassword = fullState.places[action.placeID] ? fullState.places[action.placeID].networks.wifi.password : ''

      return Immutable.Map(state)
              .set('selectedPlace', action.placeID)
              .set('ssid', newSSID)
              .set('ssidPassword', newPassword).toJS(); 

    default:
      return state
  }
}

const parseInteger = (input) => {
  var setInt = parseInt(input);
      
  if (isNaN(setInt)) {
    return 0;
  } else {
    return setInt
  }
}

const initialControlState = () => ({
    controlName: 'default',
    controlDirection: 0,
    controlType: 0,
    highValue: 100,
    lowValue: 0,
    curValue: 0,
    pinNumber: 14,
    analogOrDigital: "digital",
    pinNegativeLogic: false,
    designerControlType: "Virtual"
})
