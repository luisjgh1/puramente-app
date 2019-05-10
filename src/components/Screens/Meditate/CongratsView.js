import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { _readSessionUserData } from '../../Generics/FirebaseApiDB';
import { Button } from 'react-native-elements';
import { baseStyles, colors } from 'app/src/styles/base';
import { LinearGradient } from 'expo';

export default class CongratsView extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  _onClickContinue = async () => {
    Obj.componentWillUnmount();
    this.props.navigation.navigate('MyAccountScreen');
  }

  render() {
    return (
      <LinearGradient 
        colors={['#00a896', '#028090']} start={[0.1, 0.1]} end={[0.9, 0.9]}
        style={{ justifyContent: 'center', flex: 1}}>
        <View style={styles.container}>
          <Text style={baseStyles.h1}>¡Gran trabajo!</Text>
          <Text style={baseStyles.textLight}>Has finalizado tu sesión de hoy.</Text>

          <Button
            onPress={this._onClickContinue}
            borderRadius={8}
            backgroundColor={'rgba(0,0,0,0)'}
            color={colors.background}
            containerViewStyle={{marginTop: 20}}
            buttonStyle={[baseStyles.lightTransparentButton, styles.button]}
            title='Continuar' />
        </View>
      </LinearGradient>
    );
  }
}

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      alignSelf: 'stretch'
    },

    button: {
      paddingLeft: 40,
      paddingRight: 40
    }
  });