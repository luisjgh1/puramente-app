import React, { Component } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { _readSessionUserData } from '../../Generics/FirebaseApiDB';
import { PricingCard } from 'react-native-elements';

export default class SubscriptionView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null
    };
  }

  componentDidMount() {
    //this._getSessionUserData();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Obten una suscripción gratis</Text>
        <View style= {{flexDirection: 'row'}}>
          <PricingCard
            color='#51A151'
            title='Free'
            price='$0'
            info={['1 User', 'Basic Support', 'All Core Features']}
            button={{ title: 'COMENZAR', icon: 'flight-takeoff' }}
            onButtonPress={()=> Alert.alert('Ok, so tiene sentido')}
          />
          <PricingCard
            color='#51A151'
            title='Free'
            price='$0'
            info={['1 User', 'Basic Support', 'All Core Features']}
            button={{ title: 'COMENZAR', icon: 'flight-takeoff' }}
            onButtonPress={()=> Alert.alert('Ok, so tiene sentido')}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  texto: {
    marginTop: 20,
    marginBottom: 20,
    color: 'black',

    fontSize: 20,
    textAlign: 'center'
  }
});