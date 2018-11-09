import firebase from 'firebase'
import firebaseui from 'firebaseui'
import * as setup from '../index'
import * as actions from '../redux/actions'
import * as database from './FirebaseDatabase'
import $ from 'jquery'

export const logout = () => {
  
  firebase.auth().signOut().then(function() {

    console.log("Logged Out");

  }).catch(function(error) {

    console.log(error);
  });
}

export const checkLoginStatus = () => {

	if ( firebase.auth().currentUser ) {

	  return true

	} else {

	  return false
	}
}

export const loadUserProviders = () => {
	
	firebase.auth().currentUser.providerData.forEach((provider) => {

	    setup.store.dispatch(actions.loadLinkedAccount(provider));

	});
}

export const getMyUserImagePath = () => {
	if  (checkLoginStatus()) {
		
		if (firebase.auth().currentUser.photoURL == null) {

			database.downloadLegacyProfilePicture(firebase.auth().currentUser.uid);

		} else {
			return firebase.auth().currentUser.photoURL
		}

	} else {
		console.log(firebase.auth().currentUser.photoURL);
		return "../src/assets/Happy.jpg"
	}
}

export const currentUser = () => {

	return firebase.auth().currentUser
}

export const initializeFirebase = () => {
	var config = {
	    apiKey: "AIzaSyBR81Af8kOY1A1c1JDypaehxkeM89chtLU",
	    authDomain: "heep-3cddb.firebaseapp.com",
	    databaseURL: "https://heep-3cddb.firebaseio.com",
	    projectId: "heep-3cddb",
	    storageBucket: "heep-3cddb.appspot.com",
	    messagingSenderId: "832186256119"
	  };

	firebase.initializeApp(config);

	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    // User is signed in.
	    console.log("Welcome back, ", user.email);
	    setup.store.dispatch(actions.addUser(user));
	    setup.store.dispatch(actions.updateLoginStatus(true));
	    database.readUserData(user);	    
		//database.retrieveAnalyticData(user);
		
	    validateUser()
	    
	    VerifyUser()
	    loadUserProviders()


	  } else {
	    // No user is signed in.
	    console.log("Detected no user signed in");
	    setup.store.dispatch(actions.updateLoginStatus(false));

	    checkIfInbound();

	  }
	});

}

export const loginUser = () => {
	var afterLoginRoute = signinSuccessURL();

	firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
		.then(function() {
			
			var provider = new firebase.auth.GoogleAuthProvider();

			provider.setCustomParameters({
		        prompt: 'select_account'
		    });

			return firebase.auth().signInWithRedirect(provider);

		})
		.catch(function(error) {
			console.log(error);
		});
}

export const firebaseAuthUI = () => {
	var uiConfig = {
        callbacks: {
          signInSuccess: function(currentUser, credential, redirectUrl) {

            return true;
          },
          uiShown: function() {

            document.getElementById('loader').style.display = 'none';
          }
        },
        credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM,

        queryParameterForWidgetMode: 'mode',

        queryParameterForSignInSuccessUrl: 'signInSuccessUrl',

        signInFlow: 'redirect',
        signInSuccessUrl: signinSuccessURL(),
        signInOptions: [

          {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true
          },
          {
		      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		      customParameters: {
		        prompt: 'select_account'
		      }
		  }

        ],

        tosUrl: '/TermsOfService'
    };


	var instance = firebaseui.auth.AuthUI.getInstance();

	if (instance != null) {

		instance.delete().then(() => {

			var ui = new firebaseui.auth.AuthUI(firebase.auth());
			ui.start('#firebaseui-auth-container', uiConfig);

		});
	} else {

		var ui = new firebaseui.auth.AuthUI(firebase.auth());
		ui.start('#firebaseui-auth-container', uiConfig);
	}
}

export const handleLogin = () => {
	// if (checkMobileSafari()) {
	// 	loginUser()
	// } else {
		firebaseAuthUI()
	// }
}

const checkSafari = () => {

	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
		return true
	} else {
		return false
	}
}

const checkMobileSafari = () => {

	var ua = window.navigator.userAgent;
	console.log(ua);
	var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
	var webkit = !!ua.match(/WebKit/i);
	var iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

	return iOSSafari
}

export const linkAccount = (newProvider) => {

	switch (newProvider) {
		case 'google.com': 
			var provider = new firebase.auth.GoogleAuthProvider();
			break
		case 'facebook.com' : 
			var provider = new firebase.auth.FacebookAuthProvider();
			break
		case 'twitter.com': 
			var provider = new firebase.auth.TwitterAuthProvider();
			break
		case 'github.com': 
			var provider = new firebase.auth.GithubAuthProvider();
			break
		default : 
			console.log("Please select a provider");
			return
	}


	firebase.auth().currentUser.linkWithPopup(provider).then(function(result) {

	  var credential = result.credential;
	  var user = result.user;
	  loadUserProviders();

	}).catch(function(error) {

	  alert(error.message);
	});
}

export const unlinkAccount = (providerId) => {

	firebase.auth().currentUser.unlink(providerId).then(function() {

	  setup.store.dispatch(actions.unlinkAccount(providerId));
	
	}).catch(function(error) {

	  alert(error.message);

	});
}

const verifyEmail = (user) => {

	user.sendEmailVerification()
}

const validateUser = () => {
	if (firebase.auth().currentUser.displayName == null) {
		database.associateLegacyProfileName(firebase.auth().currentUser.uid)
	} 

	if (firebase.auth().currentUser.photoURL == null) {
		database.downloadLegacyProfilePicture(firebase.auth().currentUser.uid);
	}  
}

export const updateUserProfile = (newData) => {
	firebase.auth().currentUser.updateProfile(newData).then(() => {

	  setup.store.dispatch(actions.updateLoginStatus(false));
	  setup.store.dispatch(actions.updateLoginStatus(true));

	}).catch(function(error) {

	  console.log("Failed to Update");

	});
}

export const VerifyUser = () => {

    let actionsUID = searchURL("actionsUID") 

    if (actionsUID) {
		let user = firebase.auth().currentUser
    	$.get("/verifyUser" + "?actionsUID=" + actionsUID + "&uid=" + user.uid + "&email=" + user.email);
    }
    
}

const signinSuccessURL = () => {

    let successRoute = searchURL("successRoute") 

    if (successRoute) {

		return '/' + successRoute

    } else {

    	return '#/User'
    }
}

const searchURL = (parameter) => {

	var sPageURL = window.location.search.substring(1);

    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == parameter) {
            return sParameterName[1];
        };
    };

    return null
}

export const checkIfInbound = () => {

	if (!!searchURL("actionsUID")) {
		console.log("INBOUND");
		loginUser()
	}
}


