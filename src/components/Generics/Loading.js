import React, { Component } from 'react';
import { View,  ActivityIndicator } from 'react-native';
import { baseStyles, colors } from 'app/src/styles/base';

export class Loading extends Component {
  render() {
    return (
      <View style={[baseStyles.container, { paddingTop:75 }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
}