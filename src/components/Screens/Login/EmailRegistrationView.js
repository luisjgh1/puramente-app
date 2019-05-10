import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  ImageBackground,
  Image,
  TouchableHighlight,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { Button, FormInput } from 'react-native-elements';
import { _onPressRegister, _ValidateUserData } from '../../Generics/FirebaseAuth';
import { loginStyles, baseStyles, colors } from 'app/src/styles/base';

export default class EmailRegistration extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      pass: '',
      loading: false,
    };
  }

  _onClickRegister = async () => {
    console.disableYellowBox = true;
    this.setState({
      loading: true,
    })
    result = await _onPressRegister(this.state.name, this.state.email, this.state.pass);
    if (result == 'ok') {
      this.props.navigation.navigate('InterestsScreen');
      this.setState({
        loading: false,
      })
    } else {
      if (result != null && result != '') {
        this.setState({
          loading: false,
        })
        Alert.alert(result);
      }
    }
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  render() {
    const {
      loading
    } = this.state;

    return (
      <ImageBackground source={require('app/src/Images/background-login.jpg')} style={loginStyles.backgroundImage}>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={80}
        >
          <ScrollView>
            <View style={loginStyles.container}>
              <View style={loginStyles.header} >
                <Image source={require('app/src/Images/logo-rgb.png')} style={{ width: 100 }} resizeMode={'contain'} />
              </View>

              <View style={loginStyles.buttons}>
                <Text style={baseStyles.h1}>Registrarme</Text>

                <FormInput
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={(name) => this.setState({ name })}
                  value={this.state.name}
                  inputStyle={{ marginLeft: 10, color: 'white' }}
                  keyboardAppearance="light"
                  placeholder="Nombre"
                  autoCapitalize="words"
                  autoFocus={true}
                  autoCorrect={false}
                  returnKeyType="next"
                  underlineColorAndroid={colors.background}
                  ref={input => this.emailInput = input}
                  onSubmitEditing={() => {
                    this.emailInput.focus();
                  }}
                />

                <FormInput
                  containerStyle={{ marginVertical: 10 }}
                  onChangeText={(email) => this.setState({ email })}
                  value={this.state.email}
                  inputStyle={{ marginLeft: 10, color: 'white' }}
                  keyboardAppearance="light"
                  placeholder="Email"
                  autoFocus={false}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  returnKeyType="next"
                  underlineColorAndroid={colors.background}
                  ref={input => this.emailInput = input}
                  onSubmitEditing={() => {
                    this.setState({ email_valid: this.validateEmail(this.state.email) });
                    this.passwordInput.focus();
                  }}
                  blurOnSubmit={false}
                  errorStyle={{ textAlign: 'center', fontSize: 12 }}
                  errorMessage={this.state.email_valid ? null : "Por favor, ingrese un mail válido"}
                />

                <FormInput containerStyle={{ marginVertical: 10 }}
                  onChangeText={(pass) => this.setState({ pass })}
                  value={this.state.pass}
                  inputStyle={{ marginLeft: 10, color: 'white' }}
                  secureTextEntry={true}
                  keyboardAppearance="light"
                  placeholder="Contraseña"
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="default"
                  returnKeyType="done"
                  underlineColorAndroid={colors.background}
                  ref={input => this.passwordInput = input}
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    this._onClickRegister();
                  }}
                />
                {
                  !loading
                    ? (
                      <Button
                        buttonStyle={loginStyles.emailButton}
                        onPress={this._onClickRegister}
                        title="Registrarme" />
                    )
                    : <ActivityIndicator size="large" style={{ marginBottom: 5 }} />
                }
                <TouchableHighlight onPress={() => this.props.navigation.navigate('EmailSignInScreen')} 
                  style={loginStyles.alternativeLinks}>
                  <Text style={loginStyles.signInLink}>
                    ¿Ya tienes cuenta? Ingresar
                    </Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
          {/* <View style={{ height: 80 }} /> */}
        </KeyboardAvoidingView >
      </ImageBackground>
    );
  }
}