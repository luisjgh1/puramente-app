import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { AppLoading, Font } from 'expo';
import AuthLoading from './src/components/Screens/Login/AuthLoadingView';

export default class App extends Component {

  state = {
    loaded: false,
  }

  async componentDidMount() {
    //Load font
    await Font.loadAsync({
      'roboto': require('app/src/fonts/Roboto-Medium.ttf'),
      'noto-serif': require('app/src/fonts/NotoSerifJP-Regular.otf'),
      'noto-serif-bold': require('app/src/fonts/NotoSerifJP-Bold.otf'),
      'cabin': require('app/src/fonts/Cabin-Regular.ttf'),
      'cabin-medium': require('app/src/fonts/Cabin-Medium.ttf'),
      'cabin-semibold': require('app/src/fonts/Cabin-SemiBold.ttf'),
      'cabin-bold': require('app/src/fonts/Cabin-Bold.ttf'),
      'lato': require('app/src/fonts/Lato-Regular.ttf'),
      'lato-bold': require('app/src/fonts/Lato-Bold.ttf'),
      'lato-light': require('app/src/fonts/Lato-Light.ttf')
    });
    this.setState({ loaded: true });
  }

  render() {
    if (!this.state.loaded) {
      return <AppLoading />;
    }

    return <AuthLoading />;
  }
}

AppRegistry.registerComponent('App', () => App);