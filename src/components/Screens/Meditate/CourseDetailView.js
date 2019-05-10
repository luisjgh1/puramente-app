import React, { Component } from 'react';
import { StyleSheet, View, Text, ScrollView, Picker, TouchableHighlight } from 'react-native';
import { ListItem, Button, Tile } from 'react-native-elements';
import { baseStyles, DEVICE_WIDTH, colors, fonts } from 'app/src/styles/base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';
import { _readUserData } from '../../Generics/FirebaseApiDB';

const minutes = [
  { id: 0, name: 'Sin gong' },
  { id: 1, name: 'Gong cada 1 minuto' },
  { id: 2, name: 'Gong cada 2 minutos' },
  { id: 5, name: 'Gong cada 5 minutos' },
  { id: 10, name: 'Gong cada 10 minutos' },
  { id: 15, name: 'Gong cada 15 minutos' },
  { id: 20, name: 'Gong cada 20 minutos' },
  { id: 25, name: 'Gong cada 25 minutos' },
  { id: 30, name: 'Gong cada 30 minutos' },
  { id: 45, name: 'Gong cada 45 minutos' },
  { id: 60, name: 'Gong cada 60 minutos' },
  { id: 90, name: 'Gong cada 90 minutos' },
  { id: 120, name: 'Gong cada 120 minutos' }
];

export default class CourseDetailView extends Component {

  constructor(props) {
    super(props)
    this.userSessions= [];
    this.state = {
      isPathRequire: false,
      isSingle: false,
      listSessions: [],
      isFreeTime: false,
      minutesSelected: 5,
      nextSession: 1,
      userAllowed: true
    };
  }

  componentDidMount() {
    console.disableYellowBox = true;
    this.setState({
      isFreeTime: this.props.navigation.getParam('isFreeTime', false),
      isPathRequire: this.props.navigation.getParam('isPathRequire', false)
    })
    if (this.props.navigation.getParam('isPremium', false) && !_readUserData.isPremium)
      this.setState({ userAllowed: false })

    var list = this.props.navigation.getParam('Sessions', null);
    if (list != null) {
      if (list.length > 1) {
        //order by order property
        this.setState({
          listSessions: list.sort(function (a, b) {
            if (a.order > b.order)
              return 1;
            if (a.order < b.order)
              return -1;
            return 0;
          })
        });

        this.userSessions = this.props.navigation.getParam('UserSessions', null);
        console.log(this.userSessions);

        if (this.userSessions.length == 0)
          this.setState({
            nextSession: 0
          });
        else {
          //ispathRequired?
          list.some(function (s) {
            //Find sessionsCompleted
            var done = this.userSessions.filter(uSess => uSess.idSession == s.idSession && uSess.isSessionCompleted);
            if (done.length == 0) {
              console.log(this.state.nextSession);
              return true; //break
            }
            else {
              this.setState({
                nextSession: s.order
              });
              console.log(this.state.nextSession);
              return false;
            }
          }.bind(this));
        }

      } else {
        this.setState({ listSessions: list });
        this.setState({ isSingle: true })
      }
    }
  }

  _onClickDetail = async (data) => {
    if (this.state.isFreeTime) {
      this.props.navigation.navigate('FreePlayerScreen', {
        Id: data.idSession,
        Titulo: this.props.navigation.getParam('Name', 'Cargando..'),
        SessionsDescription: data.sessionDescription,
        SessionName: data.sessionName,
        UrlImage: this.props.navigation.getParam('ImageUrl', 'Cargando..'),
        Time: this.state.minutesSelected
      });
    } else {
      this.props.navigation.navigate('PlayerScreen', {
        Id: data.idSession,
        Titulo: data.sessionName,
        SessionsDescription: data.sessionDescription,
        SessionName: data.sessionName,
        Audio: data.audioUrl,
        UrlImage: this.props.navigation.getParam('ImageUrl', 'Cargando..')
      });
    }
  }

  _onClickPremium = async () => {
    this.props.navigation.navigate('SubscriptionScreen');
  }

  render() {
    return (
      <ScrollView style={baseStyles.containerSubSection}>
        <Tile
          imageSrc={{ uri: this.props.navigation.getParam('ImageUrl') }}
          title={this.props.navigation.getParam('Name', 'Cargando..')}
          featured
          width={DEVICE_WIDTH}
          height={230}
          activeOpacity={1}
          titleStyle={baseStyles.tileTitle}
          containerStyle={{ alignContent: "center" }}
        />
        {(!this.state.isFreeTime && !this.state.isSingle && this.state.userAllowed) ? (
          <View style={styles.buttonStyle}>
            <TouchableHighlight onPress={() => this._onClickDetail(this.state.listSessions[this.state.nextSession])}>
              <View style={{ flexDirection: 'row', alignItems: "center" }}>
                <Text style={[styles.textButtonStyle]}>
                  {this.state.listSessions.length > 0 ?
                    this.state.listSessions[this.state.nextSession].sessionName : '..'}
                </Text>
                <Icon name='play-arrow' size={25} color={"white"} />
              </View>
            </TouchableHighlight>
          </View>
        ) : null}


        <View style={styles.textView}>
          <Text style={baseStyles.text}>{this.props.navigation.getParam('Description', 'Cargando..')}</Text>
          {!this.state.isFreeTime ? (
            <Text style={[styles.courseTime, baseStyles.text]}>
              <FontAwesome name="clock-o" /> {this.props.navigation.getParam('TotalDuration', '..')}
            </Text>
          ) : null}
        </View>

        {(!this.state.isSingle && this.state.userAllowed) ? (
          <View>
            <Text style={[baseStyles.h2, { marginLeft: 10 }]}>SESIONES</Text>
            {
              this.state.listSessions.map((l, i) => (
                <ListItem
                  key={i}
                  title={l.sessionName}
                  leftIcon={this.state.nextSession > i ?
                    { name: 'check', color: colors.primary } :
                    this.state.nextSession == i ? { name: 'lens', color: colors.secondary, size: 15 } :
                      this.state.isPathRequire ? { name: 'lock' } : 'none'}
                  disabled={!this.state.isPathRequire || (this.state.isPathRequire && this.state.nextSession >= i)
                    ? false : true}
                  subtitle={l.duration}
                  titleStyle={baseStyles.text}
                  subtitleStyle={[baseStyles.text, { fontWeight: '100' }]}
                  onPress={() => this._onClickDetail(l)}
                />
              ))
            }
          </View>
        ) : null}

        {this.state.isFreeTime ? (
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Picker
              selectedValue={this.state.minutesSelected}
              style={styles.timePicker}

              onValueChange={(itemValue) => this.setState({ minutesSelected: itemValue })}>
              {minutes.map((number) => {
                return (
                  <Picker.Item label={number.name} value={number.id} />
                );
              })}
            </Picker>
          </View>
        ) : null}

        {(this.state.isFreeTime || (this.state.isSingle && this.state.userAllowed)) ? (
          <Button style={{ marginTop: 15 }}
            onPress={() => this._onClickDetail(this.state.listSessions)}
            buttonStyle={baseStyles.continueButton}
            title='Comenzar'
          />
        ) : null}

        {!this.state.userAllowed ? (
          <View>
            <View style={[styles.textView, baseStyles.alert]}>
              <Text>Este curso solo se encuentra disponible para suscripciones Premium</Text>
            </View>
            <Button style={{ marginTop: 15 }}
              onPress={() => this._onClickPremium()}
              buttonStyle={baseStyles.continueButton}
              title='Acceder a contenido Premium'
            />
          </View>
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  textView: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    paddingBottom: 10,
    paddingTop: 10
  },
  buttonStyle: {
    position: 'absolute',
    top: 207,
    width: 'auto',
    paddingRight: 15,
    paddingLeft: 22,
    paddingTop: 8,
    paddingBottom: 8,
    right: 10,
    backgroundColor: colors.secondary,
    borderRadius: 30,
    fontFamily: fonts.item
  },
  textButtonStyle: {
    color: "white",
    fontSize: 15
  },

  timePicker: {
    marginTop: 10,
    width: 250,
    padding: 5
  },
  courseTime: {
    marginTop: 10
  }
});