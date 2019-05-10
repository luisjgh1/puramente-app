import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  Alert,
  ImageBackground,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { Icon as RNIcon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'
import { _onPressRegister, _ValidateUserData } from '../../Generics/FirebaseAuth';
import { loginStyles, baseStyles, colors } from 'app/src/styles/base';

export default class EmailRegistration extends Component {

  render() {
    return (
      <ImageBackground source={require('app/src/Images/nature-bg.png')} style={loginStyles.backgroundImage}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 20,
            right: 5,
          }}
        >
          <RNIcon name="close" size={25} color="white" />
        </TouchableOpacity>
        <View style={{paddingTop: 60}}>
          <Text style={[baseStyles.largeTitle, baseStyles.tileTitle, { textAlign: 'center'}]}>
            Suscribete hoy a puramente premium y obtendras acceso a multiples beneficios.
          </Text>
          <View style={{marginTop: 25}}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Icon name="circle" style={{marginTop: 8, marginRight: 7, color: 'white'}}/>
              <Text style={[baseStyles.tileTitle, {fontSize: 17, color: 'white' }]}>
                Nuevo Contenido Semanal
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Icon name="circle" style={{marginTop: 8, marginRight: 7, color: 'white'}}/>
              <Text style={[baseStyles.tileTitle, {fontSize: 17, color: 'white' }]}>
                Mas de 50 sesiones
              </Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Icon name="circle" style={{marginTop: 8, marginRight: 7, color: 'white'}}/>
              <Text style={[baseStyles.tileTitle, {fontSize: 17, color: 'white' }]}>
                Todas las funciones de puramente
              </Text>
            </View>
          </View>
          <View style={baseStyles.cardContainer}>
            <View style={baseStyles.cardWrapper}>
              <View style={baseStyles.card}>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 18, borderBottomColor: 'white', borderBottomWidth: 2}}>
                  40% off
                </Text>
                <View>
                  <Text style={{ textAlign: 'center', color: 'white', fontSize: 25, marginTop: 20, fontWeight: 'bold'}}>
                    Anual
                  </Text>
                  <Text style={{ textAlign: 'center', color: 'white', fontSize: 18}}>
                    55,99 por mes
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[baseStyles.btn, {marginTop: 20, paddingTop: 5}]}>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 18}}>
                  Elegir
                </Text>
              </TouchableOpacity>
            </View>
            <View style={baseStyles.cardWrapper}>
              <View style={baseStyles.card}>
                <View>
                  <Text style={{ textAlign: 'center', color: 'white', fontSize: 25, marginTop: 48, fontWeight: 'bold'}}>
                    Mensual
                  </Text>
                  <Text style={{ textAlign: 'center', color: 'white', fontSize: 18}}>
                    55,99 por mes
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[baseStyles.btn, {marginTop: 20, paddingTop: 5}]}>
                <Text style={{ textAlign: 'center', color: 'white', fontSize: 18}}>
                  Elegir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}