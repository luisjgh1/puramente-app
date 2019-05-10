import React from 'react'
import { Text } from 'react-native';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { colors, fonts, loginStyles } from '../../styles/base'
import { Icon } from 'react-native-elements';

//Login
import Login from '../Screens/Login/LoginView';
import Interests from '../Screens/Login/InterestsView';
import EmailRegistration from '../Screens/Login/EmailRegistrationView';
import EmailSignIn from '../Screens/Login/EmailSignInView';
import ForgotPassword from '../Screens/Login/ForgotPasswordView';

//Meditate
import Home from '../Screens/Meditate/HomeView';
import CourseDetail from '../Screens/Meditate/CourseDetailView';
import Player from '../Screens/Meditate/PlayerView';
import Congrats from '../Screens/Meditate/CongratsView';
import FreePlayer from '../Screens/Meditate/FreePlayerView';

//More
import More from '../Screens/More/MoreView';
import Subscription from '../Screens/More/SubscriptionView';
import Notifications from '../Screens/More/NotificationsView';
import Support from '../Screens/More/SupportView';

//MyAccount
import Progress from '../Screens/MyAccount/ProgressView';

//Premium Plans
import PremiumPlans from '../Screens/PremiumPlans';


export const MainStack = createMaterialBottomTabNavigator(
  {
    MeditateScreen: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: <Text style={{ fontFamily: fonts.item }}>Meditar</Text>,
        tabBarIcon: <Icon size={25} name="home" color={colors.secondary}/>
      },
    },
    MyAccountScreen: {
      screen: Progress,
      navigationOptions: {
        tabBarLabel: <Text style={{ fontFamily: fonts.item }}>Mi progreso</Text>,
        tabBarIcon: <Icon size={25} name="person" color={colors.secondary}/>
      },
    },
    MoreScreen: {
      screen: More,
      navigationOptions: {
        tabBarLabel: <Text style={{ fontFamily: fonts.item }}>Más</Text>,
        tabBarIcon: <Icon size={25} name="more-horiz" color={colors.secondary}/>
      },
    }
  },
  {
    initialRouteName: 'MeditateScreen',
    shifting: false,
    activeTintColor: colors.tertiary,
    inactiveTintColor: colors.secondary,
    barStyle: {
      backgroundColor: colors.background
    },
  },
);


export const MeditateStack = createStackNavigator(
  {
    MainScreen: {
      screen: MainStack,
      navigationOptions: () => ({ header: null })
    },

    DetailScreen: {
      screen: CourseDetail,
      navigationOptions: () => ({ headerStyle: loginStyles.headerStack, headerTransparent: true })
    },
    PlayerScreen: {
      screen: Player,
      navigationOptions: () => ({ headerStyle: loginStyles.headerStack, headerTransparent: true })
    },
    FreePlayerScreen: {
      screen: FreePlayer,
      navigationOptions: () => ({ headerStyle: loginStyles.headerStack, headerTransparent: true })
    },
    CongratsScreen: {
      screen: Congrats,
      navigationOptions: () => ({ header: null })
    },

    SupportScreen: {
      screen: Support
    },
    SubscriptionScreen: {
      screen: Subscription,
      navigationOptions: () => ({ headerStyle: loginStyles.headerStack, headerTransparent: true })
    },
    NotificationsScreen: {
      screen: Notifications,
    },
  },
  { headerMode: 'screen' }
);

export const InterestsStack = createStackNavigator(
  {
    InterestsScreen: {
      screen: Interests,
      navigationOptions: () => ({ header: null })
    },
  },
  { initialRouteName: 'InterestsScreen' },
  { headerMode: 'none' }
);


export const LoginStack = createStackNavigator(
  {
    LoginScreen: {
      screen: Login,
      navigationOptions: () => ({ header: null })
    },
    EmailRegistrationScreen: {
      screen: EmailRegistration,
      navigationOptions: () => ({ headerStyle: loginStyles.headerStack, headerTransparent: true })
    },
    EmailSignInScreen: {
      screen: EmailSignIn,
      navigationOptions: () => ({ headerStyle: loginStyles.headerStack, headerTransparent: true })
    },
    ForgotPasswordScreen: {
      screen: ForgotPassword,
      navigationOptions: () => ({ headerStyle: loginStyles.headerStack, headerTransparent: true })
    },
  },
  { initialRouteName: 'LoginScreen' }
);



export const LoginSwitch = createSwitchNavigator(
  {
    LoginStackScreen: {
      screen: LoginStack,
      navigationOptions: () => ({ header: null })
    },
    HomeScreen: {
      screen: MeditateStack,
      navigationOptions: () => ({ header: null })

    },
    InterestsScreen: {
      screen: InterestsStack,
      navigationOptions: () => ({ header: null })
    },
  },
  { initialRouteName: 'LoginStackScreen' }
);

export const HomeSwitch = createSwitchNavigator(
  {
    LoginStackScreen: {
      screen: LoginStack,
      navigationOptions: () => ({ header: null })
    },
    HomeScreen: {
      screen: MeditateStack,
      navigationOptions: () => ({ header: null })
    },
    InterestsScreen: {
      screen: InterestsStack,
      navigationOptions: () => ({ header: null })
    },
    PremiumPlansScreen: {
      screen: PremiumPlans,
      navigationOptions: () => ({ header: null })
    },
  },
  { initialRouteName: 'HomeScreen' }
);