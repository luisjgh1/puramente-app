import React from 'react';
import { AsyncStorage } from 'react-native';
import { LoginSwitch, HomeSwitch } from '../../Generics/Routes';
import { Loading } from '../../Generics/Loading';

export default class AuthLoadingView extends React.Component {

  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      isLogged: false,
      defined: false
    }
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('id');
    if (userToken != null) {
      this.setState({ isLogged: true });
      this.setState({ defined: true });
    }
    else {
      this.setState({ defined: true });
    }
  };

  render() {
    return !this.state.defined ? (<Loading />) : (this.state.isLogged ? <HomeSwitch /> : <LoginSwitch />)
  }
}