import { StyleSheet, Dimensions } from 'react-native'

export const colors = {
  primary: '#2ACA9C',
  secondary: '#13293D',
  tertiary: '#FA8071',
  dardkGreen: '#0C7E83',
  background: 'white',
  dark: '#565E57',
  yellow: '#FEF6C9',
  yellowDark: '#B9B393'
};

export const fonts = {
  title: 'noto-serif-bold',
  paragraph: 'lato',
  item: 'lato-bold',
  itemLight: 'lato-light',
  button: 'lato-bold',
  highlight: 'lato-bold'
};

export const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

export const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 40
  },
  containerSubSection: {
    flex: 1,
    backgroundColor: colors.background
  },
  headerHome: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 50,
    alignItems: 'center'
  },
  subscribeButton: {
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 8,
    borderColor: colors.tertiary,
    borderWidth: 1
  },
  subscribeButtonText: {
    color: colors.tertiary
  },
  continueButton: {
    backgroundColor: colors.secondary,
    marginTop: 20,
    borderRadius: 8
  },
  h1: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: '#FFFFFF'
  },
  h1Dark: {
    fontSize: 20,
    fontFamily: fonts.title,
    color: colors.dark
  },
  h2: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
    fontFamily: fonts.paragraph,
    color: colors.secondary
  },
  text: {
    fontFamily: fonts.paragraph
  },
  button: {
    fontFamily: fonts.button
  },
  textLight: {
    fontFamily: fonts.paragraph,
    color: 'white'
  },
  borderRounded: {
    borderRadius: 8,
    overflow: 'hidden'
  },
  alert: {
    backgroundColor: colors.yellow,
    borderRadius: 3,
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: colors.yellowDark
  },
  darkTransparentButton: {
    borderWidth: 1.5,
    borderColor: colors.dark
  },
  lightTransparentButton: {
    borderWidth: 1.5,
    borderColor: colors.background
  },
  tileTitle: {
    fontFamily: fonts.title,
    fontWeight: '400'
  },
  tileCaption: {
    fontFamily: fonts.paragraph,
    fontSize: 18
  },
  buttonContainer: {
    width: '100%',
    marginLeft: 0
  },
  largeTitle: {
    fontSize: 24,
    fontFamily: fonts.highlight,
    color: '#FFFFFF'
  },
  cardContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  cardWrapper: {
    flex: 0.45,
  },
  card: {
    backgroundColor: 'rgba(70, 78, 71, 0.5)',
    height: 200,
    borderRadius: 5
  },
  btn: {
    backgroundColor: 'rgba(70, 78, 71, 0.5)',
    borderColor: '#FFFFFF',
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    width: '90%',
    alignSelf: 'center'
  }
});

export const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: 'rgba(70, 78, 71, 0.5)'
  },
  backgroundImage: {
    flex: 1,
    width: 'auto',
    height: 'auto'
  },
  rowFlexTop: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: (DEVICE_HEIGHT - 100) / 2.0
  },
  rowFlexControls: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: (DEVICE_HEIGHT - 100) / 2.0,
    paddingTop: 30
  },
  controlsColumns: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  controlsButton: {
    width: DEVICE_WIDTH / 3
  },
  titleContainer: {
    marginTop: 50,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 22,
    fontFamily: fonts.title,
    color: 'white'
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: fonts.paragraph,
    color: 'white'
  },
  timestampText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20
  },
  button: {
    color: 'white'
  },
  shadow: {
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    // iOS
    shadowOffset: {
      width: 0,            // These can't both be 0
      height: 1,           // i.e. the shadow has to be offset in some way
    },
    // Android
    shadowOffset: {
      width: 0,            // Same rules apply from above
      height: 1,           // Can't both be 0
    }
  },
  volumeToggle: {
    position: 'absolute',
    bottom: 15,
    left: 15
  },
  volumeBox: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    right: 5,
    height: 230,
    backgroundColor: 'rgba(0, 50, 32, 0.7)',
    borderRadius: 8
  },
  volumeBoxHeader: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  volumeBoxTitle: {
    color: 'white',
    fontSize: 20
  },
  volumeBoxControls: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5
  },
  volumeBoxLabel: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5
  },
  volumeSliderContainer: {
    flexDirection: 'row'
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0
  },
  volumeClose: {
    paddingBottom: 3,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 3
  }
});

export const loginStyles = StyleSheet.create({
  headerStack: {
    backgroundColor: 'rgba(255,255,255,0.3)'
  },
  backgroundImage: {
    flex: 1,
    width: 'auto',
    height: 'auto'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  header: {
    alignItems: 'center',
    height: 200,
  },
  logo: {
    width: 160
  },
  buttons: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 40
  },
  buttonContainer: {
    marginBottom: 15
  },
  emailButton: {
    borderWidth: 1,
    borderColor: 'white',
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 10,
    backgroundColor: 'transparent'
  },
  alternativeLinks: {
    marginTop: 20
  },
  signInLink: {
    color: 'white',
    textDecorationLine: 'underline'
  }
});
