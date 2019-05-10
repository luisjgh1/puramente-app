import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  Slider,
  ImageBackground,
  BackHandler,
  AsyncStorage,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { KeepAwake } from 'expo';
import { _writeFreeSessionUserData } from '../../Generics/FirebaseApiDB';
import BgAudio, { _onMuteBackPressed } from '../../Generics/BackgroundAudio';
import { playerStyles, colors } from 'app/src/styles/base';
import moment from 'moment';

const pad = (n) => n < 10 ? '0' + n : n;

const gong = new Expo.Audio.Sound();
class PlaylistItem {
  constructor(id, name, img, desc) {
    this.id = id;
    this.name = name;
    this.img = img;
    this.description = desc;
  }
}

export default class PlayerView extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerLeft: (
        <TouchableHighlight
          style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}
          onPress={() => {
            navigation.navigate('CongratsScreen');
          }
          }>
          <Icon name="close" />
        </TouchableHighlight>
      ),
    };
  };

  constructor(props) {
    super(props);
    //Background sound object
    Obj = new BgAudio();
    Obj.componentDidMount();
    this.time = 0;
    this.timerStoped = 0;
    this.index = 0;
    this.PLAYLIST = [
      new PlaylistItem(
        this.props.navigation.getParam('Id', ''),
        this.props.navigation.getParam('Titulo', 'Cargando...'),
        this.props.navigation.getParam('UrlImage', ''),
        this.props.navigation.getParam('SessionsDescription', '')
      ),
    ],
      this.state = {
        start: 0,
        now: 0,
        isPlaying: true,
        fontLoaded: false,
        isVolumeVisible: false,
        timeSelected: 100,
        isCompletedTime: false,
        volume: 0.3,
      };
  }

  async componentDidMount() {
    (async ()=> {
      const volume = await AsyncStorage.getItem('bg_volume');
      if (volume) {
        this.setState({volume: parseFloat(volume)})
        Obj._onVolumeSliderValueChange(parseFloat(volume));
      }
    })();
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    gong.loadAsync(require('../../../music/gong.mp3'));
    (async () => {
      this.time = this.props.navigation.getParam('Time', '');
      this.setState({
        fontLoaded: true,
        timeSelected: this.props.navigation.getParam('Time', '')
      });
    })();
    const now = new Date().getTime();
    this.setState({
      isPlaying: true
    })
    this.timer = setInterval(() => {
      this.setState({
        now: this.state.now+1000
      })
    }, 1000)
  }
  Timer = ({ interval }) => {
    if (this.state.timeSelected != 0 && moment.duration(interval).minutes() == this.state.timeSelected) {
      gong.stopAsync();
      gong.playAsync();
      this.setState({ timeSelected: this.state.timeSelected + this.time });
    }
    const duration = moment.duration(interval);
    return pad(duration.hours()) + ":" + pad(duration.minutes()) + ":" + pad(duration.seconds());
  }

  handleBackPress = () => {
    this.props.navigation.navigate('CongratsScreen');
    return true;
  }

  _onStopPressed = () => {
    clearInterval(this.timer);
    this.props.navigation.navigate('CongratsScreen');
  }

  _onPlayPausePressed = () => {
    if (this.state.isPlaying) {
      Obj.pause();
    clearInterval(this.timer);
    this.setState({ isPlaying: false });
    } else {
      Obj.play();
      this.timer = setInterval(() => {
        this.setState({
          now: this.state.now+1000
        })
      }, 1000)
      this.setState({ isPlaying: true});
    }
  }

  _onBgVolume = async (value) => {
    type = typeof value;
    try {
      Obj._onVolumeSliderValueChange(value);
      await AsyncStorage.setItem('bg_volume', '' + value);
      this.setState({ volume: value });
    } catch (error) {
      console.log('onBgVolumeRrror::::::: ', value);
    }
  };

  //Background Sound
  _onVolumePressed = () => {
    var statusVol = this.state.isVolumeVisible ? false : true;
    this.setState({ isVolumeVisible: statusVol });
  };
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    console.disableYellowBox = true;
    var timeStop = pad(moment.duration(this.state.now).hours()) + ':'
      + pad(moment.duration(this.state.now).minutes()) + ':'
      + pad(moment.duration(this.state.now).seconds());
    id = 'n0fffccc003';
    isSessionCompleted = true;
    reproductionTime = timeStop;
    dateSession = new Date();
    console.log(reproductionTime);
    result = _writeFreeSessionUserData(isSessionCompleted, reproductionTime, dateSession, id);
  }

  render() {
    const { now, start } = this.state
    const timer = now - start
    return !this.state.fontLoaded ? (
      <View />
    ) : (
        <ImageBackground source={{ uri: this.PLAYLIST[this.index].img }} style={playerStyles.backgroundImage}>
          <View style={playerStyles.container}>
            {/*This screen will never sleep!*/}
            <KeepAwake />
            {/*<BgAudio></BgAudio>*/}

            <View style={playerStyles.rowFlexTop}>
              <View style={playerStyles.titleContainer}>
                <Text style={playerStyles.titleText}>
                  {this.PLAYLIST[this.index].name}
                </Text>
                <Text style={playerStyles.subtitleText}>
                  {this.PLAYLIST[this.index].description}
                </Text>
              </View>
            </View>

            <View style={[playerStyles.rowFlexControls, { opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0 }]}>
              <View>
                <Text style={playerStyles.timestampText}>

                <this.Timer interval={timer} />

                </Text>
              </View>
              <View style={playerStyles.controlsColumns}>
                <View style={playerStyles.controlsButton}>
                  <TouchableHighlight
                    underlayColor={"rgba(255,255,255,0.0)"}
                    activeOpacity={1.0}
                    onPress={this._onPlayPausePressed}
                    disabled={this.state.isLoading}>
                    {this.state.isPlaying ?
                      <Icon name="pause" size={80} color={"white"} /> :
                      <Icon name='play-arrow' size={80} color={"white"} />}
                  </TouchableHighlight>
                </View>
                <View style={playerStyles.controlsButton}>
                  <TouchableHighlight
                    underlayColor="rgba(255,255,255,0.0)"
                    activeOpacity={1.0}
                    onPress={this._onStopPressed}>
                    <Icon name="stop" size={50} color={"white"} />
                  </TouchableHighlight>
                </View>
              </View>
            </View>

          </View >

          {this.state.isVolumeVisible ? (
            <View style={playerStyles.volumeBox}>
              <View style={playerStyles.volumeBoxHeader}>
                <View style={{ flexGrow: 1 }}>
                  <Text style={playerStyles.volumeBoxTitle}>Volumen</Text>
                </View>
                <View>
                  <TouchableHighlight
                    activeOpacity={1.0}
                    onPress={this._onVolumePressed}
                  >
                    <Icon name="close" size={25} style={playerStyles.volumeClose} color={colors.background} />
                  </TouchableHighlight>
                </View>
              </View>
              <View style={playerStyles.volumeBoxControls}>
                <Text style={playerStyles.volumeBoxLabel}>Sonido de fondo</Text>
                <Slider
                  style={playerStyles.volumeSlider}
                  value={this.state.volume}
                  onValueChange={this._onBgVolume}
                />
              </View>
            </View>
          ) : (
              <View style={playerStyles.volumeToggle}>
                {/*Buttons of Volume*/}
                <TouchableHighlight
                  activeOpacity={1.0}
                  onPress={this._onVolumePressed}
                >
                  <Icon name="volume-down" size={30} style={[playerStyles.shadow]} color={colors.background} />
                </TouchableHighlight>
              </View>
            )
          }
        </ImageBackground >
      );
  }
}