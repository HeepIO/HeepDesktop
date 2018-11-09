import firebase from 'firebase'
import * as firebaseAuth from './FirebaseAuth'
import * as setup from '../index'
import * as actions from '../redux/actions'
import * as HAPI from '../serverside/heep/HAPIMemoryParser.js'


export const readUserData = (user) => {

	firebase.database().ref('/users/' + user.uid + '/devices').on('value', function(snapshot) {
		retrieveDevices(snapshot);
	})

	firebase.database().ref('/users/' + user.uid + '/places').on('value', function(snapshot) {
		
		retrievePlaces(snapshot);
	})


	firebase.database().ref('/users/' + user.uid + '/groups').on('value', function(snapshot) {
		
		retrieveGroups(snapshot);
	})
}

const retrieveDevices = (snapshot) => {
	snapshot.forEach( function(snapChild){
		readDevice(snapChild.key);
	});
}

const readDevice = (deviceID) => {
	let dataFromFirebaseRef = firebase.database().ref('/devices/' + deviceID).on('value', function(deviceSnapshot) {

		setup.store.dispatch(actions.addDevice(deviceSnapshot.key, deviceSnapshot.val()));
	});
}

const retrievePlaces = (snapshot) => {

	snapshot.forEach( function(snapChild) {
		readPlace(snapChild.key);
	});
}

const readPlace = (placeID) => {
	let dataFromFirebaseRef = firebase.database().ref('/places/' + placeID).on('value', function(placeSnapshot) {

		if (placeSnapshot.val()) {
			
			setup.store.dispatch(actions.addPlace(placeSnapshot.key, placeSnapshot.val()));

		}  else {
			setup.store.dispatch(actions.deletePlace(placeSnapshot.key));
		}
		
	});
}


const retrieveGroups = (snapshot) => {
	snapshot.forEach( function(snapChild){
		readGroup(snapChild.key);
	});
}

const readGroup = (groupID) => {
	let dataFromFirebaseRef = firebase.database().ref('/groups/' + groupID).on('value', function(groupSnapshot) {

		setup.store.dispatch(actions.addGroup(groupSnapshot.key, groupSnapshot.val()));
	});
}

export const downloadGroupImage = (groupID) => {
	firebase.storage().ref("groups").child(String(groupID) + '/background.png').getDownloadURL().then(function(url) {
		
		document.getElementById(String(groupID)).src = url;

	}).catch(function(error) {
		
		console.log("Could not find this image");
	});
}

export const downloadLegacyProfilePicture = (uid, terminal = false, ext = '.png') => {

	firebase.database().ref('/users/' + uid + '/profile/heepID').once('value', function(snapshot) {

		firebase.storage().ref("users").child(String(snapshot.val()) + '/profile' + ext).getDownloadURL().then(function(url) {
			
			firebaseAuth.updateUserProfile({photoURL: url});

		}).catch(function(error) {
			
			if (terminal) {
				console.log("Could not find this image");
			} else {
				downloadLegacyProfilePicture(uid, true, '.jpg');
			}
		});

	});
}

export const associateLegacyProfileName = (uid) => {

	firebase.database().ref('/users/' + uid + '/profile/name').once('value', function(snapshot) {

		firebaseAuth.updateUserProfile({displayName: snapshot.val()});

	});
}

export const updatePlaceName = (placeID, name) => {

	firebase.database().ref('places/' + placeID + '/name').set(name);
}

export const updateGroupName = (groupID, name) => {

	firebase.database().ref('groups/' + groupID + '/name').set(name);
}

export const associateDeviceWithAccount = (deviceData) => {
	firebase.database().ref('devices/' + deviceData.identity.deviceID).set(deviceData);

	var user = firebaseAuth.currentUser();
	var userDeviceObj = {};
	userDeviceObj[deviceData.identity.deviceID] = true;

	firebase.database().ref('users/' + user.uid + '/devices/' + deviceData.identity.deviceID).set(userDeviceObj);
}

export const retrieveAnalyticData = (user) => {
	console.log("Reading Analytics Data");

	firebase.database().ref('/users/' + user.uid + '/devices').on('value', (snapshot) => {

		snapshot.forEach((childSnapshot) => {
	      readDeviceData(childSnapshot.key);
  		});
	});
}

const readDeviceData = (deviceID) => {

	console.log("Reading: ", deviceID);

	firebase.database().ref('/analytics/' + deviceID).on('value', function(snapshot) {

		var buffer = base64ToArrayBuffer(snapshot.val());
		var data = HAPI.ReadHeepResponse(buffer);
		
		var analytics = [];

		for (var i = 0; i < data.length; i++) {
			var MOP = data[i];

			if (MOP.op == 31) { 

				analytics.push(MOP.analytics);
			}
		}

		if (analytics.length > 0) {
			setup.store.dispatch(actions.addMemoryDumpBatch(deviceID, analytics))
		}
		;

	})
}

const base64ToArrayBuffer = (base64) => {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes;
}

export const deletePlace = (placeID) => {

	var user = firebaseAuth.currentUser();

	firebase.database().ref('/places/' + placeID).remove();
	firebase.database().ref('/users/' + user.uid + '/places/' + placeID).remove();

	console.log('Deleted Place: ', placeID);
}

export const saveNewPlace = (placeName, placeSSID, placeSSIDPassword) => {
	const placeRef = firebase.database().ref('/places').push();

	const placeObject = {
		name: placeName,
		placeID:  placeRef.key,
		networks: {
			wifi:{
				ssid: placeSSID,
				password: placeSSIDPassword
			}
		}
	}

	const placeUserObject = {
		numDevices: 0,
		placeID:  placeRef.key,
		radius: 100,
		x: 120,
		y:120
	}

	var user = firebaseAuth.currentUser();

	firebase.database().ref('/places/' + placeRef.key).set(placeObject);
	firebase.database().ref('/users/' + user.uid + '/places/' + placeRef.key).set(placeUserObject);

	console.log('Saved new Place: ', placeName);
}
