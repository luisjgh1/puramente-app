import React, {Component} from 'react';
import { Text, View, Alert, Image, ImageBackground, ScrollView, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { Button, FormInput } from 'react-native-elements';
import {_onPressForgotPass} from '../../Generics/FirebaseAuth';
import { loginStyles, baseStyles, colors } from 'app/src/styles/base';

export default class ForgotPassword extends Component {

  constructor(props) {
    super(props);
    this.state = { email: '' };
  }

  _onClickSendEmail = async () => {
    result = await _onPressForgotPass(this.state.email);
    if(result == 'ok') {
      Alert.alert('Por favor revisa tu correo, encontrarás las instrucciones para recuperar tu cuenta.');
      this.props.navigation.goBack();
    } else {
      Alert.alert(result);
    }
  }

  render() {
    return (
      <ImageBackground source={require('app/src/Images/background-login.jpg')} style={loginStyles.backgroundImage}>
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={160}
        >
          <ScrollView>
            <View style={loginStyles.container}>
              <View style={loginStyles.header} >
                <Image source={require('app/src/Images/logo-rgb.png')} style={{width: 100}} resizeMode={'contain'} />
              </View>

              <View style={loginStyles.buttons}>
                <Text style={baseStyles.h1}>Olvidé mi contraseña</Text>
                <Text style={{alignItems: 'center', color: colors.background}}>
                  Por favor, ingrese su email para solicitar el cambio de contraseña.
                </Text>

                <View style={{ marginTop: 20 }}>
                  <FormInput
                    containerStyle={{ marginVertical: 10 }}
                    onChangeText={(email) => this.setState({ email })}
                    value={this.pass}
                    inputStyle={{ marginLeft: 10, color: 'white' }}
                    keyboardAppearance="light"
                    placeholder="Email"
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
                  onPress={this._onClickSendEmail}
                  title="Enviar" />

                <TouchableHighlight onPress={() => this.props.navigation.navigate('LoginScreen')}
                  style={loginStyles.alternativeLinks} >
                  <Text style={loginStyles.signInLink}>Volver</Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView >
      </ImageBackground>
    );
  }
}