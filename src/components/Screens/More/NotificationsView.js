import React, { Component } from 'react';
import { StyleSheet, View, Text, Switch, AsyncStorage } from 'react-native';
import { Divider, Button, Icon } from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { _readUserData, _writeNotificationUserData } from '../../Generics/FirebaseApiDB';
import moment from 'moment';
import { Permissions } from 'expo';
import { baseStyles, colors, fonts } from 'app/src/styles/base'
import { NotificationMeditate, NotificationMindful } from '../../Generics/LocalNotifications';
import { Loading } from '../../Generics/Loading';

const pad = (n) => n < 10 ? '0' + n : n;

async function getiOSNotificationPermission() {
  const { status } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }
}

export default class NotificationsView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      meditateReminderEnabled: false,
      mindfulMomentReminderEnabled: false,
      meditateReminderTime: '',
      mindfulMomentReminderTime: '',
      isDateTimePickerVisible: false,
      isMeditateTime: false,
      isLoaded: false
    }
  }

  componentDidMount() {
    this._getNotificationUserData();
  }

  componentWillMount() {
    getiOSNotificationPermission();
  }

  _getNotificationUserData = async () => {
    result = await _readUserData();
    if (result != null) {
      this.setState({
        meditateReminderEnabled: result.meditateReminderEnabled
      });
      this.setState({
        mindfulMomentReminderEnabled: result.mindfulMomentReminderEnabled
      });
      if (result.meditateReminderTime) {
        this.setState({
          meditateReminderTime: pad(moment(result.meditateReminderTime, "YYYY/MM/DD HH:mm:ss").hours()) + ':'
            + pad(moment(result.meditateReminderTime, "YYYY/MM/DD HH:mm:ss").minutes())
        });
      }
      if (result.mindfulMomentReminderTime) {
        this.setState({
          mindfulMomentReminderTime: pad(moment(result.mindfulMomentReminderTime, "YYYY/MM/DD HH:mm:ss").hours()) + ':'
            + pad(moment(result.mindfulMomentReminderTime, "YYYY/MM/DD HH:mm:ss").minutes())
        });
      }
    }
    this.setState({ isLoaded: true })
  }

  _showDateTimePickerMeditate = () => {
    this.setState({ isMeditateTime: true })
    this.setState({ isDateTimePickerVisible: true })
  };

  _showDateTimePickerMindful = () => {
    this.setState({ isMeditateTime: false })
    this.setState({ isDateTimePickerVisible: true })
  };

  _hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false })
  }

  _onChangeSwitchMeditate = async () => {
    const configurationNotif = {
      time: Date.now(),
      repeat: 'day'
    };
    var statusSwitch = !this.state.meditateReminderEnabled;
    this.setState({ meditateReminderEnabled: statusSwitch })
    //if ON then activate notification
    if(statusSwitch) {
    const IdNotificationMeditate = await AsyncStorage.getItem('IdNotificacionMeditate');
    //if not exists notification then create it.
    if(IdNotificationMeditate == null)
      await NotificationMeditate(configurationNotif); //Hour
      //if OFF then cancel notification
    } else {
      if(IdNotificationMeditate != null)
      await Notifications.cancelScheduledNotificationAsync(IdNotificationMeditate);
      await AsyncStorage.removeItem('IdNotificacionMeditate');
    }
    //save value
    await _writeNotificationUserData(1, statusSwitch);
  }


  _onChangeSwitchMindful = async () => {
    const configurationNotif = {
      time: Date.now(),
      repeat: 'day'
    };
    var statusSwitch = !this.state.mindfulMomentReminderEnabled;
    this.setState({ mindfulMomentReminderEnabled: statusSwitch })
    //if ON then activate notification
    if(statusSwitch) {
      const IdNotificationMindful = await AsyncStorage.getItem('IdNotificationMindful');
      //if not exists notification then create it.
      if(IdNotificationMindful == null)
        await NotificationMindful(configurationNotif); //Hour
        //if OFF then cancel notification
      } else {
        if(IdNotificationMindful != null)
        await Notifications.cancelScheduledNotificationAsync(IdNotificationMindful);
        await AsyncStorage.removeItem('IdNotificationMindful');
      }
      //save value
    await _writeNotificationUserData(2, statusSwitch);
  }


  _handleDatePicked = async (date) => {
    console.log(date.getTime());
    var timestamp = moment(date).valueOf();
    const configurationNotif = {
      time: timestamp,
      repeat: 'day'
    };
    this._hideDateTimePicker();

    if (this.state.isMeditateTime) {
      this.setState({
        meditateReminderTime: moment(date).hours() + ':' + moment(date).minutes()
      });
      const IdNotificationMeditate = await AsyncStorage.getItem('IdNotificacionMeditate');
      //if exists notification then cancel it and create new notification with new time. 
      if(IdNotificationMeditate != null) {
        await Notifications.cancelScheduledNotificationAsync(IdNotificationMeditate);
        await AsyncStorage.removeItem('IdNotificacionMeditate');
      }
      await NotificationMeditate(configurationNotif);
      //save Time of meditation
      await _writeNotificationUserData(3, date);
    }

    else {
      this.setState({
        mindfulMomentReminderTime: moment(date).hours() + ':' + moment(date).minutes()
      });
      const IdNotificationMindful = await AsyncStorage.getItem('IdNotificationMindful');

      //if exists notification then cancel it and create new notification with new time. 
      if(IdNotificationMindful != null) {
        await Notifications.cancelScheduledNotificationAsync(IdNotificationMindful);
        await AsyncStorage.removeItem('IdNotificationMindful');
      }
      await NotificationMindful(configurationNotif);
      //save Time of meditation
      await _writeNotificationUserData(4, date);
    }
  };

  render() {
    if (this.state.isLoaded) {
      return (
        <View style={baseStyles.container}>

          <Text style={baseStyles.h1Dark}>Configurar notificaciones</Text>
          <Divider style={{ backgroundColor: colors.dark }} />


          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <View>
                <Icon name="alarm" size={20} color={colors.dark} />
              </View>
              <View style={styles.boxTitle}>
                <Text style={styles.boxHeaderText}>Recordatorio diario</Text>
              </View>
              <View>
                <Switch
                  value={this.state.meditateReminderEnabled}
                  onValueChange={this._onChangeSwitchMeditate}
                />
              </View>
            </View>
            <View style={styles.boxControls}>
              { ( this.state.meditateReminderEnabled && this.state.meditateReminderTime ) ? (
                <View>
                  <Text style={styles.boxLabel}>Todos los días a las <Text style={{fontWeight: 'bold'}}>{ this.state.meditateReminderTime }</Text></Text>
                  <Button
                    onPress={this._showDateTimePickerMeditate}
                    borderRadius={8}
                    backgroundColor={'rgba(0,0,0,0)'}
                    color={colors.dark}
                    containerViewStyle={styles.button}
                    buttonStyle={baseStyles.darkTransparentButton}
                    icon={{name: 'alarm-add', color: colors.dark}}
                    title='Cambiar horario' />
                </View>
              ) : (
                <View>
                  <Text style={styles.boxLabel}>Recibe un recordatorio diario para ayudarte a mantener tu práctica de meditación.</Text>
                  { this.state.meditateReminderEnabled ? (
                    <Button
                      onPress={this._showDateTimePickerMeditate}
                      icon={{name: 'alarm-add'}}
                      borderRadius={8}
                      containerViewStyle={styles.button}
                      backgroundColor={colors.secondary}
                      title='Configurar horario' />
                  ) : null }
                </View>
              ) }
            </View>
          </View>
          
          { false ? (
          <View style={styles.box}>
            <View style={styles.boxHeader}>
              <View>
                <Icon name="envira" type={'font-awesome'} size={20} color={colors.dark} />
              </View>
              <View style={styles.boxTitle}>
                <Text style={styles.boxHeaderText}>Tips de Pura Mente</Text>
              </View>
              <View>
                <Switch
                  value={this.state.mindfulMomentReminderEnabled}
                  onValueChange={this._onChangeSwitchMindful}
                />
              </View>
            </View>
            <View style={styles.boxControls}>
              { ( this.state.mindfulMomentReminderEnabled && this.state.mindfulMomentReminderTime ) ? (
                <View>
                  <Text style={styles.boxLabel}>Todos los días a las <Text style={{fontWeight: 'bold'}}>{ this.state.mindfulMomentReminderTime }</Text></Text>
                  <Button
                    onPress={this._showDateTimePickerMeditate}
                    icon={{name: 'alarm-add', color: colors.dark}}
                    borderRadius={8}
                    backgroundColor={'rgba(0,0,0,0)'}
                    color={colors.dark}
                    containerViewStyle={styles.button}
                    buttonStyle={baseStyles.darkTransparentButton}
                    title='Cambiar horario' />
                </View>
              ) : (
                <View>
                  <Text style={styles.boxLabel}>Recibe tips para mantener la calma y volver al presente durante tu día.</Text>
                  { this.state.mindfulMomentReminderEnabled ? (
                    <Button
                      onPress={this._showDateTimePickerMindful}
                      icon={{name: 'alarm-add'}}
                      borderRadius={8}
                      containerViewStyle={styles.button}
                      backgroundColor={colors.secondary}
                      title='Configurar horario' />
                  ) : null }
                </View>
              ) }
            </View>
          </View>
          ) : null }

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleDatePicked}
            onCancel={this._hideDateTimePicker}
            mode='time'
            />

        </View >
      );
    } else {
      return(<Loading />);
    }
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.dark,
    paddingBottom: 10
  },
  boxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    width: "100%",
    height: 50,
    backgroundColor: 'rgba(0, 50, 32, 0.2)',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  boxTitle: {
    flexGrow: 1,
    paddingLeft: 5
  },
  boxHeaderText: {
    color: colors.dark,
    fontSize: 20,
    fontFamily: fonts.item
  },
  boxControls: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5
  },
  boxLabel: {
    color: "#666",
    fontSize: 18,
    marginTop: 20,
    marginBottom: 5,
    fontFamily: fonts.paragraph
  },
  boxSwitch: {
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 3
  },

  button: {
    marginTop: 10
  }
});
