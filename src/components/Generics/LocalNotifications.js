import { AsyncStorage } from 'react-native';
import { Notifications } from 'expo';

//Channels description
const channelMeditateReminder = {
  name: 'Recordatorio PuraMente',
  description: 'Notificación para meditar.',
  sound: true,
  priority: 'default',
  vibrate: true,
  badge: false
}

const channelMindfulMomentReminder = {
  name: 'Tips PuraMente',
  description: 'Recomendaciones de puraMente.',
  sound: true,
  priority: 'default',
  vibrate: true,
  badge: false
}
//Channel for Notifications to meditate
Notifications.createChannelAndroidAsync(
  'meditateReminder',
  channelMeditateReminder
);
//Channel for Notifications to mindful
Notifications.createChannelAndroidAsync(
  'mindfulMomentReminder',
  channelMindfulMomentReminder
);

export const NotificationMeditate = async (schedulingOptions) => {
  //result = await _readMeditateNoti();
  if (result != null) {
    //Configurate notification with data.
    const localnotificationsMeditate = {
      title: 'Notificacion Meditar', //result.title,
      body: 'Es hora de meditar', //result.body,
      badge: 1,
      android: {
        channelId: 'meditateReminder',
        sound: true,
        //icon: require('../../../assets/icon.png'),
        vibrate: true
      },
      ios: {
        sound: true,
      },
    };
   Notifications.scheduleLocalNotificationAsync(
      localnotificationsMeditate,
      schedulingOptions
    ).then(function (response) {
      console.log(response);
      _storeData('IdNotificacionMeditate', response);
    });
  }
}

export const NotificationMindful = async (schedulingOptions) => {
  //result = await _readMindfulMomentNoti();
  if (result != null) {
    const localnotificationsMindful = {
      title: 'Tips PuraMente', //result.title,
      body: 'Alguna recomendación.', //result.body,
      badge: 1,
      android: {
        channelId: 'mindfulMomentReminder',
        sound: true,
        //icon: require('../../../assets/icon.png'),
        vibrate: true
      },
      ios: {
        sound: true,
      },
    };
    Notifications.scheduleLocalNotificationAsync(
      localnotificationsMindful,
      schedulingOptions
      ).then(function (response) {
        console.log(response);
        idNotificacion = response;
        _storeData('IdNotificationMindful', response);
      });
  }
}

_storeData = async (key, value) => {
  try {
  await AsyncStorage.setItem(key, value);
  } catch (error) {
  console.log(error.message);
  }
}