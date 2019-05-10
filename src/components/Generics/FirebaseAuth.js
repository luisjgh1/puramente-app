//import firebase from 'firebase';
import firebase from "@firebase/app"
import "firebase/auth"
import "firebase/database"

import { AsyncStorage } from "react-native";
import { Facebook } from 'expo';

const FACEBOOK_APP_ID = '646853175670130';

if (firebase.apps.length == 0) {
  const firebaseConfig = {
    apiKey: "AIzaSyAfBBnuE31M4P2HBxFfHIlRkt_q_L8B1OI",
    authDomain: "meditapp-91b8f.firebaseapp.com",
    databaseURL: "https://meditapp-91b8f.firebaseio.com",
    projectId: "meditapp-91b8f",
    storageBucket: "meditapp-91b8f.appspot.com"
  };
  firebase.initializeApp(firebaseConfig);
}


export const _saveUserData = async (name, email) => {
  result = false;
  date = new Date();

  //save user
  await firebase.database().ref('User/').push({
    name: name,
    email: email,
    interests: '',
    timeZone: (-1 * new Date().getTimezoneOffset()) / 60,
    isPremium: false,
    maxStreak: 0
    }).then((response) => {
    _storeData('id', response.key);
    _storeData('name', name);
    _storeData('email', email);
    console.log('El usuario se guardó correctamente.')
    result = true;
    }).catch((error) => {
    result = error.message;
    console.log('error ', error.message)
  });

  return result;
}

export const _ValidateUserData = async (email) => {
  var result = false;
  await firebase.database().ref('/User/').orderByChild("email").equalTo(email).once('value',
  function (snapshot) {
    if (snapshot.val() !== null) {
    snapshot.forEach(function(userSnap) {
    _storeData('id', userSnap.key);
    _storeData('name', userSnap.val().name);
    _storeData('email', userSnap.val().email);
    });
    result = true;
    }
  }).catch((error) => {
    console.log('error', error.message)
  });
  return result;
}


//With user and pass
export const _onPressLogin = async (email, password) => {
  result = '';
  await firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function () {
    _ValidateUserData(email);
    result = 'ok';
  })
  .catch(function (error) {
    result = error.message;
  });
  return result;
}

//With register
export const _onPressRegister = async (name, email, password) => {
  result = '';
  await firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function () {
    _saveUserData(name, email);
    result = 'ok';
  })
  .catch(function (error) {
    result = error.message;
  });
  return result;
}

//With Facebook
export const _onPressLoginFacebook = async () => {
  result = '';
  isNewUser = false;
  email = '';
  name = '';
  const { type, token } = await Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
    permissions: ['public_profile', 'email']
  });

  if (type === 'success') {
    //Firebase credential is created with the Facebook access token.
    const credential = await firebase.auth.FacebookAuthProvider.credential(token);

    await firebase.auth().signInAndRetrieveDataWithCredential(credential)
      .then(function (user) {
        name = user.additionalUserInfo.profile.name;
        email = user.additionalUserInfo.profile.email;
      }).catch(error => {
        console.log(error.message);
        result = 'Ocurrió un error inesperado.';
      });
    if (name != '') {
      //Validate if exists user on BD.
      await _ValidateUserData(email)
      .then(function (r) {
        isNewUser = r;
        console.log(isNewUser);
      });
      if (!isNewUser) {
        //If not exists user, then save user.
        await _saveUserData(name, email)
        .then(function () {
          result = 'ok';
        });
      } else {
        result = 'ok';
      }
    }
  }
  return result;
}

//Forgot Password
export const _onPressForgotPass = async (emailAddress) => {
  result = '';
  await firebase.auth().sendPasswordResetEmail(emailAddress)
  .then(function () {
    result = 'ok';
  }).catch(function (error) {
    result = error.message;
  });
  return result;
}

export const ValidateLogin = async () => {
  await firebase.auth().onAuthStateChanged((user) => {
    return user;
  });
}

export const _onPressLogOut = async () => {
  var result = '';
  await firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    result = 'ok'
    AsyncStorage.multiRemove(['id','name','email'])
  }).catch(function (error) {
    console.error('Sign Out Error', error);
    result = e.message;
  });
  return result;
}

_storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}