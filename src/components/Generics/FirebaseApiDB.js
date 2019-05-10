//import firebase from 'firebase';

import firebase from "@firebase/app"
import "firebase/auth"
import "firebase/database"
import { AsyncStorage } from "react-native";
import moment from 'moment'

// Inicializar Firebase
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

_storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    //user.additionalUserInfo.profile.email);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}


class User {
  // constructor
  constructor(name, email, interests, reminder, isPremium) {
    this.name = name;
    this.email = email;
    this.interests = interests;
    this.reminder = reminder;
    this.isPremium = isPremium;
  }
}

class Course {
  // constructor
  constructor(courseName, courseDescrription, isPremium, imageURL, category, language) {
    this.courseName = courseName;
    this.courseDescrription = courseDescrription;
    this.isPremium = isPremium;
    this.imageURL = imageURL;
    this.category = category;
    this.language = language;
  }
}

class Session {
  // constructor
  constructor(sessionName, sessionDescription, audioURL, duration, order) {
    this.sessionName = sessionName;
    this.sessionDescription = sessionDescription;
    this.audioURL = audioURL;
    this.duration = duration;
    this.order = order;
  }
}

class SessionUser {
  // constructor
  constructor(isSessionCompleted, reproductionTime, reproductionDate) {
    this.isSessionCompleted = isSessionCompleted;
    this.reproductionTime = reproductionTime;
    this.dateSession = reproductionDate;
  }
}

export const _updateInterestsData = async (interests) => {
  result = false;

  const id = await AsyncStorage.getItem('id');
  if (id !== null) {
    //save user
    await firebase.database().ref('User/' + id).update({
      interests: interests
    }).then(() => {
      result = 'ok';
    }).catch((error) => {
      result = error.message;
      console.log('error ', error.message)
    });
  }
  return result;
}

export const _readCoursesData = async () => {
  var result = '';
  await firebase.database().ref('/Course/').once('value')
    .then(function (snapshot) {
      result = (snapshot.val()) || '';
      result.shift(); //remove the first object null
    }).catch((error) => {
      result = error.message;
      console.log('error ', error.message)
    });

  return result;
}


export const _readSessionUserData = async () => {
  var result = '';
  var array = [];
  try {
    id = await AsyncStorage.getItem('id');
  } catch (error) {
    console.log(error.message);
  }
  await firebase.database().ref('/SessionUser/').orderByChild('idUser').equalTo(id).once('value')
    .then(function (snapshot) {
      if (snapshot.val() != null) {
        snapshot.forEach(function (userSessionSnap) {
          array.push(userSessionSnap.val());
        });
        result = array;
      }
      //result.shift(); //remove the first object null
    }).catch((error) => {
      result = error.message;
      console.log('error ', error.message)
    });

  return result;
}


export const _writeNotificationUserData = async (key, value) => {
  result = '';
  exists = false;
  var id = '';
  try {
    id = await AsyncStorage.getItem('id');
  } catch (error) {
    console.log(error.message);
  }
  switch (key) {
    case 1: //guarda meditateReminderEnabled
      await firebase.database().ref('User/' + id).update({
        meditateReminderEnabled: value
      }).then((response) => {
        result = 'ok';
      }).catch((error) => {
        result = error.message;
        console.log('error ', error.message)
      });
      break;

    case 2: //guarda mindfulMomentReminderEnabled
      await firebase.database().ref('User/' + id).update({
        mindfulMomentReminderEnabled: value
      }).then((response) => {
        result = 'ok';
      }).catch((error) => {
        result = error.message;
        console.log('error ', error.message)
      });
      break;

    case 3: //guarda meditateReminderTime
      var dateMoment = moment(value).format();
      await firebase.database().ref('User/' + id).update({
        meditateReminderTime: dateMoment
      }).then((response) => {
        result = 'ok';
      }).catch((error) => {
        result = error.message;
        console.log('error ', error.message)
      });
      break;

    default: //guarda mindfulMomentReminderTime
      var dateMoment = moment(value).format();
      await firebase.database().ref('User/' + id).update({
        mindfulMomentReminderTime: dateMoment
      }).then((response) => {
        result = 'ok';
      }).catch((error) => {
        result = error.message;
        console.log('error ', error.message)
      });
  }
  return result;
}

export const _writeSessionUserData = async (isCompleted, repTime, dateSession, idSession) => {
  result = '';
  exists = false;
  idSessionUser = '';
  var dateMoment = moment(dateSession).format();
  var id = '';
  try {
    id = await AsyncStorage.getItem('id');
  } catch (error) {
    console.log(error.message);
  }

  //save sessionUser
  /*await firebase.database().ref('/SessionUser/')
    .orderByChild("idUser").equalTo(id)
    .once('value', function (snapshot) {
      if (snapshot.val() != null) {
        snapshot.forEach(function (userSessionSnap) {
          if (userSessionSnap.val().idSession == idSession)
            idSessionUser = userSessionSnap.key;
        });
      }
    }).catch((error) => {
      console.log(error.message);

    });
  if (idSessionUser != '') {
    await firebase.database().ref('SessionUser/' + idSessionUser).update({
      isSessionCompleted: isCompleted,
      reproductionTime: repTime,
      dateSession: dateMoment,
      idUser: id,
      idSession: idSession
    }).then((response) => {
      result = 'ok';
    }).catch((error) => {
      result = error.message;
      console.log('error ', error.message)
    });
  } else {*/
    await firebase.database().ref('SessionUser/').push({
      isSessionCompleted: isCompleted,
      reproductionTime: repTime,
      dateSession: dateMoment,
      idUser: id,
      idSession: idSession
    }).then((response) => {
      result = 'ok';
    }).catch((error) => {
      result = error.message;
      console.log('error ', error.message)
    });
  //}
  return result;
}

export const _writeFreeSessionUserData = async (isCompleted, repTime, dateSession, idSession) => {
  result = '';
  exists = false;
  idSessionUser = '';
  var dateMoment = moment(dateSession).format();
  var id = '';
  try {
    id = await AsyncStorage.getItem('id');
  } catch (error) {
    console.log(error.message);
  }

  //save sessionUser
    await firebase.database().ref('SessionUser/').push({
      isSessionCompleted: isCompleted,
      reproductionTime: repTime,
      dateSession: dateMoment,
      idUser: id,
      idSession: idSession
    }).then((response) => {
      result = 'ok';
    }).catch((error) => {
      result = error.message;
      console.log('error ', error.message)
    });
  return result;
}


export const _readUserData = async () => {
  result = '';
  exists = false;
  idSessionUser = '';
  var id = '';
  try {
    id = await AsyncStorage.getItem('id');
  } catch (error) {
    console.log(error.message);
  }

  await firebase.database().ref('/User/' + id)
    .once('value', function (snapshot) {
      result = (snapshot.val()) || '';
    }).catch((error) => {
      console.log(error.message);
    });
  return result;
}



export const _readMaxStreakUserData = async () => {

}




