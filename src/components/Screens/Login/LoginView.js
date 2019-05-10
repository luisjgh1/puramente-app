import React, { Component } from 'react';
import { Alert, Text, View, ImageBackground, Image, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { _onPressLoginFacebook, _ValidateUserData } from '../../Generics/FirebaseAuth';
import { loginStyles } from 'app/src/styles/base';

export default class LoginView extends Component {

  _onClickFacebook = async () => {
    console.disableYellowBox = true;
    result = await _onPressLoginFacebook();
    if (result == 'ok') {
      this.props.navigation.navigate('HomeScreen');
    } else {
      if (result != null && result != '')
      Alert.alert(result);
    }
  }

  render() {
    return (
      <ImageBackground source={require('app/src/Images/background-login.jpg')} style={loginStyles.backgroundImage}>
        <View style={loginStyles.container}>
          <View style={loginStyles.header} >
            <Image source={require('app/src/Images/logo-rgb.png')} style={loginStyles.logo} resizeMode={'contain'} />
          </View>
          
          <View style={loginStyles.buttons}>
            <View style={loginStyles.buttonContainer}>
              <Icon.Button name="facebook" onPress={this._onClickFacebook}
                style={loginStyles.emailButton}
                backgroundColor={'#466BAE'} borderRadius={10}>
                Continuar con Facebook
              </Icon.Button>
            </View>
            <View style={loginStyles.buttonContainer}>
              <Icon.Button name="envelope-o"
                style={loginStyles.emailButton}
                backgroundColor={'rgba(0,0,0,0)'} borderRadius={10}
                onPress={() => this.props.navigation.navigate('EmailRegistrationScreen')} >
                Registrarme con email
              </Icon.Button>
            </View>

            <TouchableHighlight onPress={() => this.props.navigation.navigate('EmailSignInScreen')} 
              style={loginStyles.alternativeLinks} >
              <Text style={loginStyles.signInLink}>
                ¿Ya tienes cuenta? Ingresar
              </Text>
            </TouchableHighlight>
          </View>
        </View>
      </ImageBackground>
    );
  }
}