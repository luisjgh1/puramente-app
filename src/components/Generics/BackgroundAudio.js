import React from 'react';
import { Audio } from 'expo';


export default class BgAudio extends React.Component {

  constructor(props) {
    super(props);
    this.soundInstance = null,
    this.muted = false,
      this.source = { local: require('../../music/ocean.mp3') },
      this.state = {
        shouldPlay: false,
        isPlaying: true,
        volume: 0.3,
        rate: 1.0,
      };
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playsInBackgroundModeIOS: true,
      playsInBackgroundModeAndroid: true,
    });
    this._loadNewPlaybackInstance(true);
  }

  async _loadNewPlaybackInstance(playing) {
    if (this.soundInstance != null) {
      await this.soundInstance.unloadAsync();
      this.soundInstance.setOnPlaybackStatusUpdate(null);
      this.soundInstance = null;
    }
    const source = this.source.local;
    const initialStatus = {
      shouldPlay: playing,
      rate: this.state.rate,
      volume: this.state.volume,
    };

    const { sound, status } = await Audio.Sound.create(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.soundInstance = sound;
    this.soundInstance.setIsLoopingAsync(true);
  }

  stop = () => {
    if (this.soundInstance != null) {
      this.soundInstance.stopAsync();
    }
  }

  pause = () => {
    if (this.soundInstance != null) {
      this.soundInstance.pauseAsync();
    }
  }

  play = () => {
    if (this.soundInstance != null) {
      this.soundInstance.playAsync();
    }
  }

  _onVolumeSliderValueChange = value => {
    if (this.soundInstance != null) {
      this.soundInstance.setVolumeAsync(value);
    }
  };

  _onMuteBackPressed = (value) => {
    if (this.soundInstance != null) {
      this.soundInstance.setIsMutedAsync(value);
       // this.muted = !(this.muted);

    }
  };

  componentWillUnmount() {
  this.soundInstance.unloadAsync();
  }

  // Does not render any view 
  render() {
    return (
      null
    );
  }
}
