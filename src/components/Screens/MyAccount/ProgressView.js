import React, { Component } from 'react';
import CalendarPicker from 'react-native-calendar-picker';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { _readSessionUserData, _readUserData } from '../../Generics/FirebaseApiDB';
import moment from 'moment';
import { baseStyles, colors } from 'app/src/styles/base'
import { Loading } from '../../Generics/Loading';
import { NavigationEvents } from 'react-navigation';
import { fonts, DEVICE_WIDTH } from '../../../styles/base';

const today = moment();
const yesterday = moment().add(-1, 'day');

export default class ProgressView extends Component {

  constructor(props) {
    super(props);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.state = {
      selectedStartDate: null,
      data: [],
      isloaded: false
    };
    this.progress = {
      actualStreak: 0,
      maxStreak: 0,
      meditingTime: '0h 0m',
      totalSessions: 0
    }
    this.customDatesStyles = []
  }

  componentDidMount() {
    if (this.state.isloaded)
      this.setState({ isloaded: false });

    console.disableYellowBox = true;
    this._getSessionUserData();
  }

  forceUpdateHandler() {
    this.forceUpdate();
  };

  removeDuplicates(myArr) {
    var dataUniq = []
    var datesPushed = [];
    myArr.forEach(function (object) {
      if (!datesPushed.includes(object.dateSession.substring(0, 10))) { //if not exists the same date
        datesPushed.push(object.dateSession.substring(0, 10));
        dataUniq.push(object);
      }
    });
    return dataUniq;
  }

  _showCalendarColors() {
    var calendarDays = [];
    this.state.data.forEach(function (object) {
      calendarDays.push({
        date: moment(object.dateSession, "YYYY/MM/DD HH:mm:ss"),
        style: { backgroundColor: colors.primary },
        textStyle: { color: 'white' }, // sets the font color
        containerStyle: [], // extra styling for day container
      });
    });
    this.customDatesStyles = calendarDays;
  }

  _showActualStreak() {
    let dataUnique = this.removeDuplicates(this.state.data);
    let count = 0;
    dataUnique.forEach(function (object) {
      if (moment(object.dateSession).isSame(today, 'day')) {
        count++
      } else if (moment(object.dateSession).isSame(yesterday, 'day')) {
        count++;
        yesterday.add(-1, 'day');
      }
    });
    this.progress.actualStreak = count;
  }

  _showMaxStreak(maxStreak) {
    this.progress.maxStreak = maxStreak

  }

  _showMeditingTime() {
    var time = moment.duration('00:00:00');
    this.state.data.forEach(function (object) {
      if (object.reproductionTime.length > 5) {
        time = time.add(moment(object.reproductionTime, 'hh:mm:ss').seconds(), 'seconds');
        time = time.add(moment(object.reproductionTime, 'hh:mm:ss').minutes(), 'minutes');
        time = time.add(moment(object.reproductionTime, 'hh:mm:ss').hours(), 'hours');
      } else {
        time = time.add(moment(object.reproductionTime, 'mm:ss').seconds(), 'seconds');
        time = time.add(moment(object.reproductionTime, 'mm:ss').minutes(), 'minutes');
        time = time.add(moment(object.reproductionTime, 'mm:ss').hours(), 'hours');
      }
    });
    this.progress.meditingTime = time.hours() + 'h ' + time.minutes() + 'm';
  }

  _showTotalSession() {
    var total = 0;
    this.state.data.forEach(function (object) {
      total++;
    });
    this.progress.totalSessions = total;
  }

  _getSessionUserData = async () => {
    result = await _readSessionUserData();
    if (result != null) {
      if (result.length > 0) {
        result = result.filter(session => session.isSessionCompleted);
        var progressItems = result;
        if (progressItems.length > 0) {
          //order by dateSession
          progressItems = progressItems.sort(function (left, right) {
            return moment(right.dateSession).diff(moment(left.dateSession))
          });

          this.setState({
            data: progressItems
          });
          this._showCalendarColors();
          this._showActualStreak();
          user = await _readUserData();
          if (user != null)
            this._showMaxStreak(user.maxStreak);
          this._showMeditingTime();
          this._showTotalSession();
        }
      }
    }
    this.setState({ isloaded: true });
  };

  render() {
    return (
      this.state.isloaded ? (
        <ScrollView>
          <NavigationEvents
            onDidFocus={() => this.componentDidMount()}
          />
          <View style={baseStyles.header} >
            <Text style={baseStyles.h1}>Mi progreso</Text>
          </View>
          <View style={[baseStyles.container, { paddingTop: 30 }]}>
            {this.progress.actualStreak > 0 ? (
              <View style={styles.currentStreakContainer}>
                <View style={styles.currentStreak}>
                  <Text style={styles.currentStreakNumber}>{this.progress.actualStreak}</Text>
                  <Text style={[{color: 'white'}, styles.metricLabel]} >DÍAS DE RACHA </Text>
                </View>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', flex: 1 }}>
              <View style={{ alignItems: 'center', width: "33%" }}>
                <Icon name="spa" size={30} color={colors.dark} />
                <View>
                  <Text style={styles.metricLabel} >Sesiones {"\n"} completadas </Text>
                </View>
                <View >
                  <Text style={styles.metricNumber}>{this.progress.totalSessions}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', width: "33%" }}>
                <Icon name="terrain" size={30} color={colors.dark} />
                <View>
                  <Text style={styles.metricLabel} >Máxima {"\n"} racha </Text>
                </View>
                <View >
                  <Text style={styles.metricNumber}>{this.progress.maxStreak}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', width: "33%" }}>
                <Icon name="query-builder" size={30} color={colors.dark} />
                <View>
                  <Text style={styles.metricLabel} >Minutos {"\n"} meditando  </Text>
                </View>
                <View >
                  <Text style={styles.metricNumber}>{this.progress.meditingTime}</Text>
                </View>
              </View>
            </View>

            <View style={styles.calendarContainer}>
              <CalendarPicker
                months={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre']}
                weekdays={['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']}
                previousTitle={' < '}
                nextTitle={' > '}
                customDatesStyles={this.customDatesStyles}
                allowRangeSelection={false}
                selectedDayColor='transparent'
                maxDate={moment()}
                maxMonth={moment()}
                onMonthChange={this.onMonthChange}
                textStyle={{ fontFamily: fonts.itemLight }}
                onPressDay={()=> {}}
              />
            </View>
          </View>
        </ScrollView>
      ) :
        <Loading />
    );
  }
}

const styles = StyleSheet.create({
  metricNumber: {
    fontSize: 25,
    color: colors.tertiary,
    fontFamily: fonts.highlight
  },
  metricLabel: {
    textAlign: 'center',
    fontFamily: fonts.item
  },
  calendarContainer: {
    //height: (DEVICE_HEIGHT / 5) * 2,
    width: DEVICE_WIDTH - 20,
    marginBottom: 20,
    marginTop: 40
  },
  currentStreakContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 15
  },
  currentStreak: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.secondary,
    backgroundColor: colors.tertiary,
    borderWidth: 0,
    borderRadius: 5,
    width: 250,
    padding: 5
  },
  currentStreakNumber: {
    fontSize: 20,
    color: 'white',
    fontFamily: fonts.highlight
  }
})