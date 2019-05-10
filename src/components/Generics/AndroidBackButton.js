import { BackHandler } from 'react-native';
/**
 * Attaches an event listener that handles the android-only hardware
 * back button
 * @param  {Function} callback The function to call on click
 */
const handleAndroidBackButton = callback => {
  BackHandler.addEventListener('hardwareBackPress', () => {
    callback();
    return true;
  });
};
/**
 * Removes the event listener in order not to add a new one
 * every time the view component re-mounts
 */
const removeAndroidBackButtonHandler = () => {
  BackHandler.removeEventListener('hardwareBackPress', () => { });
}

// packages
import { Alert } from 'react-native';
const exitAlert = () => {
  Alert.alert(
    'Confirm exit',
    'Do you want to quit the app?'
    [
    { text: 'CANCEL', style: 'cancel' },
    { text: 'OK', onPress: () => BackHandler.exitApp() }
    ]
  );
};


const exitPlayerAlert = () => {
  Alert.alert(
    'Advertencia',
    '¿Está seguro que desea salir?',
    [
      { text: 'Cancel' },
      {
        text: 'OK', onPress: () => {
          Obj.componentWillUnmount();
          navigation.navigate('MainScreen')
        }
      }
    ]
  );
};


export { handleAndroidBackButton, removeAndroidBackButtonHandler, exitAlert, exitPlayerAlert };