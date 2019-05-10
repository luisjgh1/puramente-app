import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { ListItem, List, Icon } from 'react-native-elements';
import { baseStyles, colors } from 'app/src/styles/base'
import { _onPressLogOut } from '../../Generics/FirebaseAuth'
import { fonts } from '../../../styles/base';
export default class MoreView extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  _LogOut = async () => {
    result = await _onPressLogOut();
    if (result == 'ok') {
      console.log(result)
      this.props.navigation.navigate('LoginStackScreen');
    } else {
      if (result != null && result != '')
        Alert.alert(result);
    }
  }

  render() {
    const list = [
      {
        title: 'Configurar notificaciones',
        link: () => { this.props.navigation.navigate('NotificationsScreen') },
        icon: 'notifications-none'
      },
      {
        title: 'PuraMente Premium',
        link: () => { this.props.navigation.navigate('SubscriptionScreen') },
        icon: 'star-border'
      },
      {
        title: 'Ayuda y sugerencias',
        link: () => { this.props.navigation.navigate('SupportScreen') },
        icon: 'help-outline'
      },
      {
        title: 'Salir',
        link: () => { this._LogOut() },
        icon: 'exit-to-app'
      }
    ]

    return (
      <View style={{ flex: 1 }}>
        <View style={baseStyles.header} >
          <Text style={baseStyles.h1}>Opciones</Text>
        </View>
        <View style={baseStyles.containerSubSection}>
          <List containerStyle={{ marginBottom: 20, backgroundColor: colors.background }}>
            {
              list.map((item, i) => (
                <ListItem
                  title={item.title}
                  leftIcon={{ name: item.icon }}
                  onPress={item.link}
                  titleStyle={{fontFamily: fonts.item}}
                  key={i}
                />
              ))
            }
          </List>
        </View>
      </View>
    );
  }
}