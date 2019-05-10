import React, { Component } from 'react';
import { WebView } from 'react-native';

export default class MyWeb extends Component {
  render() {
  return (
    <WebView
    source={{uri: 'https://puramente.freshdesk.com/support/tickets/new'}}
    />
  );
  }
}