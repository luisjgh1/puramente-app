import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  ScrollView
} from 'react-native';
import { Button, FormInput } from 'react-native-elements';
import { _onPressLogin, _ValidateUserData } from '../../Generics/FirebaseAuth';
import {
  handleAndroidBackButton,
  removeAndroidBackButtonHandler,
  exitAlert
} from '../../Generics/AndroidBackButton';
import {
  loginStyles,
  baseStyles,
  colors
} from 'app/src/styles/base';

export default class EmailSignIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      fontLoaded: false,
      email_valid: true,
      pass: '',
      login_failed: false,
      showLoading: false
    };
  }

  componentDidMount() {
    handleAndroidBackButton(exitAlert);
  }
  componentWillUnMount() {
    removeAndroidBackButtonHandler();
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  _onClickLogin = async () => {
    console.disableYellowBox = true;
    result = await _onPressLogin(this.state.email, this.state.pass);
    if (result == 'ok') {
      this.props.navigation.navigate('HomeScreen');
    } else {
      if (result != null && result != '')
        Alert.alert(result);
    }
  }

  render() {
    return (
      <ImageBackground
        source={require('app/src/Images/background-login.jpg')}
        style={loginStyles.backgroundImage}
      >
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={140}>
          <ScrollView>
            <View style={loginStyles.container}>
              <View style={loginStyles.header} >
                <Image
                  source={require('app/src/Images/logo-rgb.png')}
                  style={{ width: 100 }}
                  resizeMode={'contain'}
                />
              </View>

              <View style={loginStyles.buttons}>
                <Text style={baseStyles.h1}>Iniciar Sesión</Text>

                <View>
                  <FormInput
                    containerStyle={{ marginVertical: 10 }}
                    onChangeText={email => this.setState({ email })}
                    value={this.email}
                    inputStyle={{ marginLeft: 10, color: 'white' }}
                    keyboardAppearance="light"
                    placeholder="Email"
                    autoFocus={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    underlineColorAndroid={colors.background}
                    returnKeyType="next"
                    ref={input => this.emailInput = input}
                    onSubmitEditing={() => {
                      this.setState({ email_valid: this.validateEmail(email) });
                      this.passwordInput.focus();
                    }}
                    blurOnSubmit={false}
                    errorStyle={{ textAlign: 'center', fontSize: 12 }}
                    errorMessage={this.state.email_valid ? null : "Por favor, ingrese un mail válido"}
                  />

                  <FormInput
                    containerStyle={{ marginVertical: 10 }}
                    onChangeText={(pass) => this.setState({ pass })}
                    value={this.pass}
                    inputStyle={{ marginLeft: 10, color: 'white' }}
                    secureTextEntry={true}
                    keyboardAppearance="light"
                    placeholder="Password"
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="default"
                    underlineColorAndroid={colors.background}
                    returnKeyType="done"
                    ref={input => this.passwordInput = input}
                    blurOnSubmit={true}
                  />
                </View>

                <Button
                  buttonStyle={loginStyles.emailButton}
                  onPress={this._onClickLogin}
                  title="Ingresar" />

                <TouchableHighlight
                  onPress={() => this.props.navigation.navigate('ForgotPasswordScreen')}
                  style={loginStyles.alternativeLinks}>
                  <Text style={loginStyles.signInLink}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({

});