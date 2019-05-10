import i18n from 'i18next';
import Expo from 'expo';
// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector = {
  type: 'languageDetector',
  async: true, // async detection
  detect: (cb) => {
  return Expo.Util.getCurrentLocaleAsync()
    .then(lng => { cb(lng); })
  },
  init: () => {},
  cacheUserLanguage: () => {}
}
i18n
  .use(languageDetector)
  .init({
  fallbackLng: 'es',
  resources: {
    //English
    en: {
      Login: {
      title: 'MeditApp',
      btnFacebook: 'Login with Facebook',
      btnEmail: 'Login with Email',
      btnLogin: 'You have a account? Sign In'
    },
    Register: {
      title: 'Welcome to MeditApp',
      name: 'Your name',
      email: 'Your email',
      pass: 'Password'
    },
    LoginEmail: {
      title: 'Login',
      email: 'E-mail',
      pass: 'Password',
      btnSignIn: 'Sign In',
      forgetPass: 'Did you forget your password?',
      noAccount: "Don't you have a account? Login"
    },
    Home: {
      title: 'What do you expect about MediAtpp?',
      next: 'Continue'
    },
    Course: {
      title: 'Start here',
      freeCourse: 'free',
      Intro: 'Introducing to free meditation'
    },
    CourseDetail: {
      title: '',
      session: 'Sessions',

    },
    Player: {
      session: 'Session'
    },
    CongratsSesion: {
      congrats: 'Congratulations!',
      finished: 'You finished your daily session.',
      next: 'Continue' 
    },
    MyAccount: {
      title: 'My progress',
      currentstreak: 'Current continuous Streak',
      maxStreak: 'Max. continuos Streak',
      meditMin: 'Minutes you have been mediting',
      total: 'Total sessions'
    },
    More: {
      title: 'More',
      notification: 'Daily notification',
      freeSuscripcion: 'Get a free suscription',
      help: 'Help',
      exit: 'Sign Out'
    },
  },
    //Spanish
    es: {
      Login: {
        title: 'MeditApp',
        btnFacebook: 'Registrarme con Facebook',
        btnEmail: 'Registrarme con Email',
        btnLogin: '¿Ya tienes una cuenta? Ingresar'
      },
      Register: {
        title: 'Bienvenido a MeditApp',
        name: 'Tu nombre',
        email: 'Tu email',
        pass: 'Contraseña'
      },
      LoginEmail: {
        title: 'Ingreso a MeditApp',
        email: 'E-mail',
        pass: 'Contraseña',
        btnSignIn: 'Ingresar',
        forgetPass: '¿Olvidaste tu contraseña?',
        noAccount: "¿No tienes una cuenta? Registrarme"
      },
      Home: {
        title: '¿Cuál es el objetivo de usar MeditApp?',
        next: 'Continuar'
      },
      Course: {
        title: 'Comienza aquí',
        freeCourse: 'Gratis',
        Intro: 'Introducción a meditation gratis'
      },
      CourseDetail: {
        title: '',
        session: 'Sesiones',
  
      },
      Player: {
        session: 'Sesión'
      },
      CongratsSesion: {
        congrats: 'Buen trabajo!',
        finished: 'Has completado tu sesión de hoy.',
        next: 'Continuar' 
      },
      MyAccount: {
        title: 'Mi progreso',
        currentstreak: 'Racha continua actual',
        maxStreak: 'Máxima racha continua',
        meditMin: 'Minutos meditando',
        total: 'Sesiones totales'
      },
      More: {
        title: 'Mas',
        notification: 'Recordatorio diario',
        freeSuscripcion: 'Gana una inscripción gratis',
        help: 'Ayuda',
        exit: 'Salir'
      }
    }
  },
    // have a initial namespace
    ns: ['translation'],
    defaultNS: 'translation',
    interpolation: {
    escapeValue: false // not needed for react
    }
  });
export default i18n;