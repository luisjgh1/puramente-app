import React, { Component } from 'react';
import { View, Text, ScrollView, Alert, ImageBackground, Image } from 'react-native';
import { Button } from 'react-native-elements';
import SelectMultiple from 'react-native-select-multiple';
import { _updateInterestsData } from '../../Generics/FirebaseApiDB';
import { loginStyles, baseStyles, colors } from 'app/src/styles/base';

const options = [
  { label: "Reducir estrés", value: "stress" },
  { label: "Calmar ansiedad", value: "anxiety" },
  { label: "Aprender a meditar", value: "learn-meditation" },
  { label: "Mejorar concentración", value: "concentration" },
  { label: "Ser feliz", value: "happiness" },
  { label: "Dormir mejor", value: "sleep" }
];

export default class Intersts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedChoice: []
    }
  }

  onSelectionsChange = (selectedChoice) => {
    this.setState({ selectedChoice });
  }

  _onClickContinue = async () => {
    var interests = '';
    this.state.selectedChoice.map((i) => {
      interests += i.value + ',';
    })
    console.ignoredYellowBox = ['Setting a timer'];
    result = await _updateInterestsData(interests);
    if (result == 'ok') {
      this.props.navigation.navigate('HomeScreen');
    } else
      Alert.alert(result);
  }

  render() {
    return (
      <ImageBackground source={require('app/src/Images/nature-bg.png')} style={loginStyles.backgroundImage}>
        <ScrollView>
          <View style={loginStyles.container}>
            <View style={loginStyles.header} >
              <Image source={require('app/src/Images/logo.png')} style={{width: 100}} resizeMode={'contain'} />
            </View>
            
            <View style={loginStyles.buttons}>
              <Text style={baseStyles.h1}>¿Cuál es el objetivo usando Pura Mente?</Text>

              <SelectMultiple
                rowStyle={{ backgroundColor: "rgba(220,220,220,0.7)" }}
                items={options}
                selectedItems={this.state.selectedChoice}
                onSelectionsChange={this.onSelectionsChange}
                checkboxSource={require('../../../Images/uncheck.png')}
                selectedCheckboxSource={require('../../../Images/check.png')}
                style={{ width: '90%' }}
                selectedLabelStyle={{ fontWeight: 'bold' }}
                labelStyle={{ color: colors.dark }}
              />

              <Button
                buttonStyle={loginStyles.emailButton}
                containerViewStyle={{ marginTop: 15 }}
                onPress={this._onClickContinue}
                title="Continuar" />
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}