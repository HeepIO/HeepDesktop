import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Immutable from 'immutable'
import { createStore, applyMiddleware } from 'redux'
import reducers from './redux/reducers'
import App from './components/App'
import thunk from 'redux-thunk'
import $ from 'jquery'
import { composeWithDevTools } from 'redux-devtools-extension';
import * as actions_classic from './redux/actions_classic'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import { PersistGate } from 'redux-persist/integration/react'

import 'firebaseui/dist/firebaseui.css';

const startState = {
  webGLStatus: false,
  loginStatus: false,
  providers: {},
  devices_firebase:{},
  places: {},
  groups: {},

  devices: {},
  deviceWiFiCreds: {},
  positions: {},
  controls: {
    connections: {}
  },
  vertexList: {},
  icons: {},
  url: '',
  analytics: {},
  analyticsDeviceList: [],
  displayingAnalytics: '',

  designer: {
    deviceName: '',
    numControls: 0,
    physicalLayer: 'wifi',
    selectedPlace: 'Enter New WiFi',
    ssid: '',
    ssidPassword: '',
    applicationName: 'Custom',
    systemType: 'ESP8266',
    iconSelected: 1,
    selectingIcon: false,
    controls: {}
  },
  flowchart: {
    updateVertex: false,
    scale: 0.8,
    devices: {},
    liveModeReference: null,
    showVertices: true,
    isDragging: false,
    lockState: false
  },
  detailsPanelDeviceID: null,
  accessPoints: {},
  accessPointData: {
    connectedTo: null,
    currentlyConnecting: null,
    failedAttempt: null,
    deviceID: null
  },
  stateSnapshots: {},
  preferences: {
    searchMode: 'broadcast'
  },
  selectedOutput: {}
}

export const initialState = Immutable.Map(startState);

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)
export const store = createStore(persistedReducer, startState, composeWithDevTools(applyMiddleware(thunk)));

let persistor = persistStore(store);

//export const store = createStore(reducers, startState, composeWithDevTools(applyMiddleware(thunk)));

import(/* webpackChunkName: "firebaseAuth" */ './firebase/FirebaseAuth').then((auth) => auth.initializeFirebase());

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App/>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
)

var loadDevicesFromServer = (url) => {
  console.log("Loading from server...");

  $.ajax({
    url: url,
    type: 'POST',
    data: {searchMode: 'broadcast'},
    cache: false,
    success: (data) => {

      try {
        data.url = window.location.origin;
        store.dispatch(actions_classic.overwriteFromServer(data));

      }
      catch (err) {
        console.log("Running on Dev server, cannot update url or feed classic data");
      }

    },
    error: (xhr, status, err) => {
      console.error(url, status, err.toString());
      }
    });
}

var timeoutRef = setInterval(() => loadDevicesFromServer(window.location.origin.concat('/api/findDevices')), 2000)

setTimeout(() => clearTimeout(timeoutRef), 6000);
