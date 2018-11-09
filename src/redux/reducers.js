import { combineReducers } from 'redux'
import Immutable from 'immutable'
import { initialState } from '../index'
import * as actions from './actions'
import * as async from './async'
import * as utils from '../serverside/utilities/generalUtilities'
import reducersDesigner from './reducers_designer'
import { TweenLite } from 'gsap'
import theme from '../components/Theme'
import { persistStore, persistReducer } from 'redux-persist'
import * as setup from '../index'
import deepEqual from 'deep-equal'

export default function(state = initialState, action) {

  switch (action.type) {
    case 'LOGIN' :

      import(/* webpackChunkName: "firebaseAuth" */ '../firebase/FirebaseAuth').then((auth) => auth.handleLogin());

      return state

    case 'UPDATE_WEBGL_STATUS':

      return Immutable.Map(state).set('webGLStatus', action.status).toJS()

    case 'LOGOUT':

      import(/* webpackChunkName: "firebaseAuth" */ '../firebase/FirebaseAuth').then((auth) => auth.logout());

      return initialState

    case 'LOGIN_STATUS' :

      return Immutable.Map(state).set('loginStatus', action.status).toJS()

    case 'LOAD_PROVIDER' :

      var newState = Immutable.Map(state.providers).set(action.provider.providerId, action.provider).toJS();

      return Immutable.Map(state).set('providers', newState).toJS()

    case 'UNLINK_PROVIDER' :

      var newState = Immutable.Map(state.providers).delete(action.providerId).toJS();

      return Immutable.Map(state).set('providers', newState).toJS()

    case 'ADD_DEVICE' :

      var newState = Immutable.Map(state.devices_firebase).set(action.deviceID, action.device).toJS();

      return Immutable.Map(state).set('devices_firebase', newState).toJS()

    case 'ADD_PLACE' :

      var newState = Immutable.Map(state.places).set(action.placeID, action.place).toJS();

      return Immutable.Map(state).set('places', newState).toJS()

    case 'ADD_GROUP' :

      var newState = Immutable.Map(state.groups).set(action.groupID, action.group).toJS();

      return Immutable.Map(state).set('groups', newState).toJS()

    case 'CLAIM_DEVICE' :

      var deviceIdentity = Immutable.Map(state.devices[action.deviceID]).toJS();
      var deviceControlStruct = state.controls.controlStructure[action.deviceID];
      var controls = [];

      for (var i = 0; i < deviceControlStruct.inputs.length; i++) {
        var controlKey = deviceControlStruct.inputs[i];
        var thisControl = Immutable.Map(state.controls[controlKey]).toJS();
        controls.push(thisControl);
      }

      for (var i = 0; i < deviceControlStruct.outputs.length; i++) {
        var controlKey = deviceControlStruct.outputs[i];
        var thisControl = Immutable.Map(state.controls[controlKey]).toJS();
        controls.push(thisControl);
      }

      var device = {
        controls: controls,
        identity: deviceIdentity
      }

      import(/* webpackChunkName: "firebaseDatabase" */ '../firebase/FirebaseDatabase').then((database) => database.associateDeviceWithAccount(device));

      return state

    case 'ADD_MEMORY_DUMP' :

      var newData = Immutable.Map(state.analytics).toJS();
      var pushPacket = action.MOP.analytics;
      pushPacket.deviceID = action.deviceID;
      var thisDeviceData = newData[action.deviceID.toString()];
      var analyticsDeviceList = Immutable.List(state.analyticsDeviceList).toJS();

      if (thisDeviceData != undefined) {

        var analyticsList = Immutable.List(thisDeviceData).push(pushPacket).toJS();
        var newDeviceData = Immutable.Map(state.analytics).set(action.deviceID.toString(), analyticsList).toJS();

        return Immutable.Map(state).set('analytics', newDeviceData).toJS();


      } else {
        console.log("Start analytics device");

        var analyticsList = Immutable.List([]).push(pushPacket).toJS();
        analyticsDeviceList.push(action.MOP.deviceID.toString());
        var newDeviceData = Immutable.Map(state.analytics).set(action.deviceID.toString(), analyticsList).toJS();

        return Immutable.Map(state).set('analytics', newDeviceData).set('analyticsDeviceList', analyticsDeviceList).set('displayingAnalytics', action.deviceID.toString()).toJS();

      }

    case 'ADD_MEMORY_DUMP_BATCH' :

      var newData = Immutable.Map(state.analytics).toJS();

      newData[action.deviceID] = action.MOParray;


      var analyticsDeviceList = Immutable.List(state.analyticsDeviceList).toJS();

      analyticsDeviceList.indexOf(action.deviceID) === -1 ? analyticsDeviceList.push(action.deviceID) : console.log("This item already exists");

      return Immutable.Map(state).set('analytics', newData).set('analyticsDeviceList', analyticsDeviceList).set('displayingAnalytics', action.deviceID.toString()).toJS();


    case 'SELECT_DEVICE_FOR_ANALYTICS' :

      return Immutable.Map(state).set('displayingAnalytics', action.deviceID).toJS()

    case 'LOGIN_TO_FIREBASE' :

      import(/* webpackChunkName: "firebaseAuth" */ '../firebase/FirebaseAuth').then((auth) => auth.firebaseAuthUI());

      return state

    case 'LOGOUT_OF_FIREBASE' :

      import(/* webpackChunkName: "firebaseAuth" */ '../firebase/FirebaseAuth').then((auth) => auth.logout());

      return state

    case 'ADD_USER':

      return Immutable.Map(state).set('user', action.user).toJS();







//<----------------------------------------------------------------------------------------------------------------------------------->

    case 'OVERWRITE_WITH_SERVER_DATA':

      if (!state.flowchart.isDragging) {
        var newStateDevices = checkDeepEqualityDevices(Immutable.Map(state.devices).toJS(), action.fromServer.devices)
        var newStateControls = checkDeepEquality(Immutable.Map(state.controls).toJS(), action.fromServer.controls)
        var newStatePositions = checkDeepEquality(Immutable.Map(state.positions).toJS(), action.fromServer.positions)
        var newStateVertexList = checkDeepEqualityVertices(Immutable.Map(state.vertexList).toJS(), action.fromServer.vertexList)
        var newStateAnalytics = checkDeepEquality(Immutable.Map(state.analytics).toJS(), action.fromServer.analytics)
        var newStateWifi = checkDeepEquality(Immutable.Map(state.deviceWiFiCreds).toJS(), action.fromServer.deviceWiFiCreds)

        return Immutable.Map(state) .set('devices', newStateDevices)
                                    .set('controls', newStateControls)
                                    .set('positions', newStatePositions)
                                    .set('vertexList', newStateVertexList)
                                    .set('analytics', newStateAnalytics)
                                    .set('deviceWiFiCreds', newStateWifi)
                                    .toJS()
      } else {
        return state
      }

    case 'STORE_URL':

      return Immutable.Map(state).set('url', action.url).toJS()

    case 'ADD_ICON':

      console.log('Adding: ', action.icon);
      var newState = Immutable.Map(state.icons).set(action.deviceID, action.icon).toJS();

      return Immutable.Map(state).set('icons', newState).toJS();

    case 'SELECT_OUTPUT':

      //var newState = Immutable.Map(state.vertexList).set('selectedOutput', {txDeviceID: action.txDeviceID, txControlID: action.txControlID}).toJS();
      return Immutable.Map(state).set('selectedOutput', {txDeviceID: action.txDeviceID, txControlID: action.txControlID}).toJS();

    case 'ADD_VERTEX':

      var newVertex = {txDeviceID: state.selectedOutput.txDeviceID,
                       txControlID: state.selectedOutput.txControlID,
                       rxDeviceID: action.rxDeviceID,
                       rxControlID: action.rxControlID,
                       timeSinceDiscovered: 0,
                       rxIP: state.devices[action.rxDeviceID].ipAddress}

      var newVertexName = utils.nameVertex(newVertex);

      if (!(newVertexName in state.vertexList && state.vertexList[newVertexName].timeSinceDiscovered==0)) {
        async.sendVertexToServer(newVertex);
      }

      var newState = Immutable.Map(state.vertexList).set(newVertexName, newVertex).toJS();

      //CONTROL CHANGES
      var newStateControls = Immutable.Map(state.controls).toJS();

      var txName = utils.nameControl(state.selectedOutput.txDeviceID, state.selectedOutput.txControlID);
      var rxName = utils.nameControl(action.rxDeviceID, action.rxControlID);

      newStateControls.connections[txName].push(rxName);

      return Immutable.Map(state).set('vertexList', newState).set('controls', newStateControls).toJS();

    case 'DELETE_VERTEX':

      const thisVertex = state.vertexList[action.vertexID];
      
      async.sendDeleteVertexToServer(thisVertex);

      var newState = Immutable.Map(state.vertexList).delete(action.vertexID).toJS();

      //CONTROLS
      var newStateControls = Immutable.Map(state.controls).toJS();

      var txName = utils.getTxControlNameFromVertex(thisVertex);
      var rxName = utils.getRxControlNameFromVertex(thisVertex);

      var index = newStateControls.connections[txName].indexOf(rxName);

      if ( index != -1) {
        newStateControls.connections[txName].splice(index, 1);
      }

      return Immutable.Map(state).set('vertexList', newState).set('controls', newStateControls).toJS();

    case 'UPDATE_VERTEX':
      var newState = Immutable.Map(state.flowchart).toJS();
      newState.updateVertex = !state.flowchart.updateVertex;

      return Immutable.Map(state).set('flowchart', newState).toJS()

    case 'UPDATE_DRAGGING':
      var newState = Immutable.Map(state.flowchart).toJS();
      newState.isDragging = !state.flowchart.isDragging;

      return Immutable.Map(state).set('flowchart', newState).toJS()

    case 'POSITION_DEVICE':
      var newState = Immutable.Map(state.positions).toJS();

      for (var id in state.positions[action.deviceID]){

        newState[action.deviceID][id] = {
          top: action.newPosition['top'] + state.positions[action.deviceID][id]['top'],
          left: action.newPosition['left'] + state.positions[action.deviceID][id]['left']
        }
      }

      return Immutable.Map(state).set('positions', newState).toJS()

    case 'POSITION_DEVICE_SEND':

      async.sendPositionToServer(action.deviceID, action.newPosition);
      var newState = Immutable.Map(state.positions).toJS();
      newState[action.deviceID] = action.newPosition;

      return Immutable.Map(state).set('positions', newState).toJS()

    case 'UPDATE_CONTROL_VALUE':

      var newState = Immutable.Map(state.controls).toJS();
      var identifier = utils.nameControl(action.deviceID, action.controlID);
      var clampedValue = clamp(action.newValue, newState[identifier].valueLow, newState[identifier].valueHigh)

      newState[identifier].valueCurrent = action.newValue;
      async.sendValueToServer(action.deviceID, action.controlID, clampedValue);

      var connectedControl = '';
      for (var i = 0; i < newState.connections[identifier].length; i++){
        connectedControl = newState.connections[identifier][i];

        if (newState[connectedControl]) {

          newState[connectedControl].valueCurrent = clampedValue;
          async.sendValueToServer(newState[connectedControl].deviceID, newState[connectedControl].controlID, clampedValue);
        }
      }

      return Immutable.Map(state).set('controls', newState).toJS()

    case 'REFRESH_FLOWCHART' :

      async.refreshLocalDeviceState(state.preferences.searchMode);

      return state

    case 'HARD_REFRESH_FLOWCHART' :

      async.hardRefreshLocalDeviceState(state.preferences.searchMode);

      var newState = Immutable.Map(state.devices).toJS();

      for (var eachDevice in newState) {
        if (!newState[eachDevice].active) {
          delete newState[eachDevice]
        }
      }

      return Immutable.Map(state).set('devices', newState).toJS()

    case 'SAVE_NEW_PLACE' :

      import(/* webpackChunkName: "firebaseDatabase" */ '../firebase/FirebaseDatabase').then((database) =>database.saveNewPlace(action.placeName, action.placeSSID, action.placeSSIDPassword));

      return state

    case 'DELETE_PLACE_FROM_FIREBASE' :

     import(/* webpackChunkName: "firebaseDatabase" */ '../firebase/FirebaseDatabase').then((database) => database.deletePlace(action.placeID));

      return state

    case 'DELETE_PLACE':

      var newState = Immutable.Map(state.places).delete(action.placeID).toJS();

      return Immutable.Map(state).set('places', newState).toJS()

    case 'START_LIVE_MODE':

      var newState = Immutable.Map(state.flowchart)
                              .set('liveModeReference', async.startLiveMode(state.preferences.searchMode))
                              .toJS();

      return Immutable.Map(state).set('flowchart', newState).toJS();

    case 'STOP_LIVE_MODE':

      async.stopLiveMode(state.flowchart.liveModeReference);
      var newState = Immutable.Map(state.flowchart)
                              .set('liveModeReference', null)
                              .toJS();

      return Immutable.Map(state).set('flowchart', newState).toJS();

    case 'SET_DETAILS_DEVICE_ID' :

      if (action.deviceID == null ) {
        TweenLite.to('#flowchartOptions', 0.5, {x: 0, ease: Sine.easeInOut});
        TweenLite.to('#detailsPanel', 0.5, {x: 300, ease: Sine.easeInOut});
      } else {
        TweenLite.to('#flowchartOptions', 0.5, {x: -300, ease: Sine.easeInOut});
        TweenLite.to('#detailsPanel', 0.5, {x: 0, ease: Sine.easeInOut});
      }

      return Immutable.Map(state).set('detailsPanelDeviceID', action.deviceID).toJS()

    case 'SEARCH_FOR_ACCESS_POINTS' :

      async.searchForAccessPoints();

      return state

    case 'SET_ACCESS_POINTS' :

      return Immutable.Map(state).set('accessPoints', action.accessPoints).toJS()

    case 'CONNECT_TO_ACCESS_POINT' :

      async.connectToAccessPoint(action.ssid);

      return Immutable.fromJS(state).setIn(['accessPointData','currentlyConnecting'], action.ssid).toJS()

    case 'SET_ACCESS_DATA' :

      return Immutable.Map(state).set('accessPointData', action.packet).toJS()

    case 'SET_SEARCH_MODE':

      return Immutable.fromJS(state)
                      .setIn(['preferences','searchMode'], action.searchMode)
                      .toJS()

    case 'RESET_DEVICE_AND_OS_WIFI':

      async.resetDeviceAndOSWifi(action.deviceID, state.preferences.searchMode);

      return state

    case 'RESET_DEVICE_WIFI':

      async.resetDeviceWifi(action.deviceID);

      return state

    case 'SEND_WIFI_CRED_TO_DEVICE' :
      var newState = Immutable.Map(state.deviceWiFiCreds).toJS();

      const ssid = state.places[action.placeKey].networks.wifi.ssid;
      const password = state.places[action.placeKey].networks.wifi.password;

      if (newState[action.deviceID] == undefined) {
        newState[action.deviceID] = {}
      }

      newState[action.deviceID][ssid] = true;

      async.sendWifiCredsToServer(action.deviceID, ssid, password);

      return Immutable.Map(state).set('deviceWiFiCreds', newState).toJS();

    case 'ZOOM_OUT_FLOWCHART':
      if (state.flowchart.scale <= 0.3) {
        return state
      } else {
        return Immutable.fromJS(state).setIn(['flowchart', 'scale'], state.flowchart.scale - 0.1).toJS()
      }



    case 'ZOOM_IN_FLOWCHART':
      if (state.flowchart.scale >= 1.5) {
        return state
      } else {
        return Immutable.fromJS(state).setIn(['flowchart', 'scale'], state.flowchart.scale + 0.1).toJS()
      }

    case 'COLLAPSE_DEVICE':
      if (state.flowchart.devices[action.deviceID] == undefined) {
        var newState = Immutable.Map(state.flowchart.devices).toJS();
        newState[action.deviceID] = initialDeviceFlowchartState()
        return Immutable.fromJS(state).setIn(['flowchart', 'devices'], newState).toJS()
      } else {
        return Immutable.fromJS(state).setIn(['flowchart', 'devices', action.deviceID, 'collapsed'], !state.flowchart.devices[action.deviceID].collapsed).toJS()
      }

    case 'SAVE_SNAPSHOT':
      var currentState = Immutable.Map(state.controls).toJS();
      var randomHash = makeid(8);

      const newSnapshot = {
        name: action.name,
        controls: currentState
      }

      return Immutable.fromJS(state).setIn(['stateSnapshots', randomHash], newSnapshot).toJS()

    case 'OPEN_SNAPSHOT_UPLOAD':

      async.parseSnapshotUpload(action.file)

      return state

    case 'SAVE_SNAPSHOT_UPLOAD':

      var randomHash = makeid(8);
      var newSnapshot = action.json;

      console.log(newSnapshot)

      return Immutable.fromJS(state).setIn(['stateSnapshots', randomHash], newSnapshot).toJS()

    case 'RETURN_TO_SNAPSHOT':
      var newState = Immutable.Map(state.controls).toJS();

      for (var thisControl in state.stateSnapshots[action.snapshotID].controls) {
        if (thisControl != 'connections' && thisControl != 'controlStructure') {
          if (state.stateSnapshots[action.snapshotID].controls[thisControl].controlDirection == 0) {

            if ( newState[thisControl]) {
              const thisControlObject = state.stateSnapshots[action.snapshotID].controls[thisControl];
              newState[thisControl].valueCurrent = thisControlObject.valueCurrent;
              async.sendValueToServer(thisControlObject.deviceID, thisControlObject.controlID, thisControlObject.valueCurrent)
            }

          }
        }
      }

      return Immutable.fromJS(state).set(controls, newState).toJS()

    case 'UPDATE_LOCK_STATE' :
      var newState = Immutable.Map(state.flowchart).toJS();
      newState.lockState = !state.flowchart.lockState;
      console.log("update lock state")

      return Immutable.Map(state).set('flowchart', newState).toJS()

    case 'UPDATE_VERTEX_VISIBILITY' :
      var newState = Immutable.Map(state.flowchart).toJS();
      newState.showVertices = !state.flowchart.showVertices;

      return Immutable.Map(state).set('flowchart', newState).toJS()

    default:
      // console.log('Passed through first Switch');
  }

  const builderStartingState = Immutable.Map(state.designer).toJS();
  const builderState = reducersDesigner(builderStartingState, action, state);

  if (builderState !== builderStartingState) {
    return  Immutable.Map(state).set('designer', builderState).toJS()
  }

  return state

}

const initialDeviceFlowchartState = () => ({
    collapsed: true,
})

function makeid(number) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < number; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const checkDeepEquality = (newState, check, elseCase = () => {}) => {

  for (var propToCheck in check) {
    if (!deepEqual(newState[propToCheck], check[propToCheck])) {
      newState[propToCheck] = check[propToCheck];
    }
  }

  return newState
}

const checkDeepEqualityDevices = (newState, check) => {

  // For any discovered devices, replace old data with new data
  for (var propToCheck in check) {
    if (!deepEqual(newState[propToCheck], check[propToCheck])) {
      newState[propToCheck] = check[propToCheck];
    }
  }

  // For any missing devices from the most recent device search, set active state to false
  for (var originalDevices in newState) {
    if (!(originalDevices in check)) {
      newState[originalDevices].active = false
    }
  }

  return newState
}

const checkDeepEqualityVertices = (newState, check) => {

  // For any discovered vertices, replace old data with new data
  newState = checkDeepEquality(newState, check);

  // For any missing vertices from the most recent device search, increment timeSinceDiscovery
  for (var originalVertices in newState) {
    if (!(originalVertices in check) && originalVertices != 'selectedOutput') {

      // If very old, just remove the vertex to keep managed state at a minimum
      if (newState[originalVertices].timeSinceDiscovered > 25) {
          delete newState[originalVertices]
      } else {
        newState[originalVertices].timeSinceDiscovered += 1
      }
    }
  }

  return newState
}

function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
}
