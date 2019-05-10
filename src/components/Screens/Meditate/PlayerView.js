import React, { Component } from 'react';
import {
  Text,
  TouchableHighlight,
  View,
  Slider,
  Alert,
  ImageBackground,
  BackHandler,
  AsyncStorage,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Audio, Video, KeepAwake } from 'expo';
import { _writeSessionUserData } from '../../Generics/FirebaseApiDB';
import BgAudio, { _onMuteBackPressed } from '../../Generics/BackgroundAudio';
import { playerStyles, colors, DEVICE_WIDTH, DEVICE_HEIGHT } from 'app/src/styles/base';

class PlaylistItem {
  constructor(id, name, uri, img, desc, isVideo) {
    this.id = id;
    this.name = name;
    this.uri = uri;
    this.img = img;
    this.description = desc;
    this.isVideo = isVideo;
  }
}

const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;

const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 16;
const LOADING_STRING = 'Cargando sesión...';
const RATE_SCALE = 3.0;

const VIDEO_CONTAINER_HEIGHT = DEVICE_HEIGHT * 2.0 / 5.0 - FONT_SIZE * 2;

export default class PlayerView extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      headerLeft: (
        <TouchableHighlight
          style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}
          onPress={() => {
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
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <Icon name="close" />
        </TouchableHighlight>
      ),
    };
  };

  constructor(props) {
    super(props);

    //Background sound object
    Obj = new BgAudio();
    this.index = 0;
    this.counter = 0;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.isMutedBack = false;
    this.PLAYLIST = [
      new PlaylistItem(
        this.props.navigation.getParam('Id', ''),
        this.props.navigation.getParam('Titulo', 'Cargando...'),
        this.props.navigation.getParam('Audio', ''),
        this.props.navigation.getParam('UrlImage', ''),
        this.props.navigation.getParam('SessionsDescription', ''),
        false
      ),
    ],

    this.state = {
      showVideo: false,
      playbackInstanceName: LOADING_STRING,
      playbackInstanceDescription: '',
      mutedSession: false,
      mutedBack: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: true,
      isPlaying: false,
      isFirstTime: true,
      isBuffering: false,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      bgVolume: 0.3,
      rate: 1.0,
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,
      useNativeControls: false,
      throughEarpiece: false,
      isVolumeVisible: false,
    };
  }

  componentDidMount() {
    //Control Android Backhandler
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
    Obj.componentDidMount();
  }

  async componentWillMount() {
    (async () => {
      try {
        const bgVolume = await AsyncStorage.getItem('bg_volume');
        const volume = await AsyncStorage.getItem('volume');

        if (volume) {
          this.setState({
            volume: parseFloat(volume),
          })
        }
        if (bgVolume) {
          this.setState({
            bgVolume: parseFloat(bgVolume),
          })
        }
      } catch (err) {
        console.log('VOLUME ERROR::: ', err)
      }
    })();
  }

  handleBackPress = () => {
    Alert.alert(
      'Advertencia',
      '¿Está seguro que desea salir?',
      [
        { text: 'Cancel' },
        {
          text: 'OK', onPress: () => {
            Obj.componentWillUnmount();
            this.props.navigation.navigate('MainScreen')
          }
        }
      ]
    );
    return true;
  }

  async _loadNewPlaybackInstance(playing) {
    try {
      const volume = await AsyncStorage.getItem('volume');
      if (this.playbackInstance != null) {
        await this.playbackInstance.unloadAsync();
        this.playbackInstance.setOnPlaybackStatusUpdate(null);
        this.playbackInstance = null;
      }
      const source = { uri: this.PLAYLIST[this.index].uri };
      const initialStatus = {
        shouldPlay: playing,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
        volume: volume ? parseFloat(volume) : 1.0,
        isMuted: this.state.mutedSession,
      };

      if (this.PLAYLIST[this.index].isVideo) {
        this._video.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
        await this._video.loadAsync(source, initialStatus);
        this.playbackInstance = this._video;
        const status = await this._video.getStatusAsync();
      } else {
        const { sound, status } = await Audio.Sound.create(
          source,
          initialStatus,
          this._onPlaybackStatusUpdate
        );
        this.playbackInstance = sound;
      }

      this._updateScreenForLoading(false);
    } catch (err) {
      console.log('PlayBackError:::::: ', err)
    }
  }

  _mountVideo = component => {
    this._video = component;
    if (this.state.isFirstTime) {
      this._loadNewPlaybackInstance(true);
      this.setState({ isFirstTime: false });
    }

  };

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        playbackInstanceName: this.PLAYLIST[this.index].name,
        playbackInstanceDescription: this.PLAYLIST[this.index].description,
        showVideo: this.PLAYLIST[this.index].isVideo,
        isLoading: false,
      });
    }
  }

  _onPlaybackStatusUpdate = status => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        mutedSession: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
      if (status.didJustFinish && !status.isLooping) {
        this._advanceIndex(true);
        //this._updatePlaybackInstanceForIndex(true);
        this.props.navigation.navigate('CongratsScreen');
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onLoadStart = () => {
    console.log(`ON LOAD START`);
  };

  _onLoad = status => {
    console.log(`ON LOAD : ${JSON.stringify(status)}`);
  };

  _onError = error => {
    console.log(`ON ERROR : ${error}`);
  };

  _onReadyForDisplay = event => {
    const widestHeight = DEVICE_WIDTH * event.naturalSize.height / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      this.setState({
        videoWidth: VIDEO_CONTAINER_HEIGHT * event.naturalSize.width / event.naturalSize.height,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
      });
    } else {
      this.setState({
        videoWidth: DEVICE_WIDTH,
        videoHeight: DEVICE_WIDTH * event.naturalSize.height / event.naturalSize.width,
      });
    }
  };

  _onFullscreenUpdate = event => {
    console.log(`FULLSCREEN UPDATE : ${JSON.stringify(event.fullscreenUpdate)}`);
  };

  _advanceIndex(forward) {
    this.index = (this.index + (forward ? 1 : this.PLAYLIST.length - 1)) % this.PLAYLIST.length;
  }

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);

    this.setState({
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,
    });

    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.counter++;
        this.playbackInstance.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.stopAsync();
    }
  };

  _onVolumePressed = () => {
    var statusVol = this.state.isVolumeVisible ? false : true;
    this.setState({ isVolumeVisible: statusVol });
    //if (this.playbackInstance != null) {
    //  this.playbackInstance.setIsMutedAsync(!this.state.mutedSession);
    // }
  };

  _onBgVolume = value => {
    Obj._onVolumeSliderValueChange(value);
    AsyncStorage.setItem('bg_volume', '' + value);
  };

  ////

  _onVolumeSliderValueChange = value => {
    if (this.playbackInstance != null) {
      this.playbackInstance.setVolumeAsync(value);
    }
    AsyncStorage.setItem('volume', '' + value);
  };

  _trySetRate = async (rate, shouldCorrectPitch) => {
    if (this.playbackInstance != null) {
      try {
        await this.playbackInstance.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {
        // Rate changing could not be performed, possibly because the client's Android API is too old.
      }
    }
  };

  _onRateSliderSlidingComplete = async value => {
    this._trySetRate(value * RATE_SCALE, this.state.shouldCorrectPitch);
  };

  _onPitchCorrectionPressed = async value => {
    this._trySetRate(this.state.rate, !this.state.shouldCorrectPitch);
  };


  _onSeekSliderSlidingComplete = async value => {
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return '';
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    console.disableYellowBox = true;
    id = this.PLAYLIST[0].id;
    isSessionCompleted = false;
    reproductionTime = '';
    dateSession = new Date();
    //get the time audio where it was stopped.
    timeStop = this._getMMSSFromMillis(this.state.playbackInstancePosition);
    duration = this._getMMSSFromMillis(this.state.playbackInstanceDuration);
    if (timeStop == duration)
      isSessionCompleted = true;

    reproductionTime = timeStop;
    //console.ignoredYellowBox = ['Setting a timer'];
    result = _writeSessionUserData(isSessionCompleted, reproductionTime, dateSession, id);
    //kill streaming
    //Obj.componentWillUnmount();
    if (this.playbackInstance != null) {
      this.playbackInstance.unloadAsync();
    }
  }

  render() {
    return false ? (
      <View />
    ) : (
      <ImageBackground source={{ uri: this.PLAYLIST[this.index].img }} style={playerStyles.backgroundImage}>
        <View style={playerStyles.container}>
          {/*This screen will never sleep!*/}
          <KeepAwake />
          {/*<BgAudio></BgAudio>*/}
          <Video
            ref={this._mountVideo}
            style={{width: 0, height: 0}}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onError={this._onError}
            onFullscreenUpdate={this._onFullscreenUpdate}
            onReadyForDisplay={this._onReadyForDisplay}
            useNativeControls={this.state.useNativeControls}
          />

          <View style={playerStyles.rowFlexTop}>
            <View style={playerStyles.titleContainer}>
              <Text style={playerStyles.titleText}>
                {this.state.playbackInstanceName}
              </Text>
              <Text style={playerStyles.subtitleText}>
                {this.state.playbackInstanceDescription}
              </Text>
            </View>
          </View>

          <View style={[playerStyles.rowFlexControls, { opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0 }]}>
            <View>
              <Text style={playerStyles.timestampText}>
                {this._getTimestamp()}
              </Text>
            </View>
            <View>
              <TouchableHighlight
                underlayColor={"rgba(255,255,255,0.0)"}
                activeOpacity={1.0}
                onPress={this._onPlayPausePressed}
                disabled={this.state.isLoading}>
                { this.state.isPlaying ?
                  <Icon name="pause" size={80} color={"white"} /> :
                  <Icon name='play-arrow' size={80} color={"white"} /> }
              </TouchableHighlight>
            </View>
          </View>

        </View >

        {this.state.isVolumeVisible ? (
          <View style={playerStyles.volumeBox}>
            <View style={playerStyles.volumeBoxHeader}>
              <View style={{flexGrow: 1}}>
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
              <Text style={playerStyles.volumeBoxLabel}>Voz</Text>
              <View style={playerStyles.volumeSliderContainer}>
                <Icon name="volume-off" size={15} color={colors.background} />
                <Slider
                  style={playerStyles.volumeSlider}
                  value={this.state.volume}
                  onValueChange={this._onVolumeSliderValueChange}
                />
                <Icon name="volume-up" size={15} color={colors.background} />
              </View>
              <Text style={playerStyles.volumeBoxLabel}>Sonido de fondo</Text>
              <View style={playerStyles.volumeSliderContainer}>
                <Icon name="volume-off" size={15} color={colors.background} />
                <Slider
                  style={playerStyles.volumeSlider}
                  value={this.state.bgVolume}
                  onValueChange={this._onBgVolume}
                />
                <Icon name="volume-up" size={15} color={colors.background} />
              </View>
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