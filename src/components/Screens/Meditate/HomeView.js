import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList
} from 'react-native';
import { Button, Tile } from 'react-native-elements';
import Image from 'react-native-scalable-image';

import { _readCoursesData, _readUserData, _readSessionUserData } from '../../Generics/FirebaseApiDB';
import { Loading } from '../../Generics/Loading';
import { baseStyles, DEVICE_WIDTH, fonts } from '../../../styles/base';

const freeWayMeditation = {
  imageUrl: "https://firebasestorage.googleapis.com/v0/b/meditapp-91b8f.appspot.com/o/Images%2Fbirds%400%2C25x.jpg?alt=media&token=602dd934-5c1d-49d3-a2ff-7bf5d453e978",
  description: "Eres tu propio guía, puedes usar el sonido del gong como recordatorio para volver al presente.",
  name: "Meditación libre"
}

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      featuredCourse: null,
      isPremiumUser: false,
      isCompletedSessionIntro: true,
      freeCourses: [],
      premiumCourses: [],
      userSessions: [],
      quickStartCourses: [],
    }
  }

  componentDidMount() {
    this._getCourseData();
    this._getPremiumUser();
  }


  _getCourseData = async () => {
    console.disableYellowBox = true;
    result = await _readCoursesData();
    if (result != null) {
      //first object is Introduction.
      var introItem = result[0];
      result.shift(); //remove first element because it's intro
      this.setState({ featuredCourse: introItem });

      //filter by premium courses
      var PremiumCourses = result.filter(course => course.category.premium);
      this.setState({ premiumCourses: PremiumCourses })

      //filter by free courses
      var FreeCourses = result.filter(course => course.category.singles);
      this.setState({ freeCourses: FreeCourses })

      //filter by quick start courses
      var QuickStartCourses = result.filter(course => course.category.quickstart);
      this.setState({ quickStartCourses: QuickStartCourses })

      resultSessions = await _readSessionUserData();

      if (resultSessions != null) {
        this.setState({
          userSessions: resultSessions
        });
        //isCompletedSessionIntro?
        var sessions = introItem.sessions;
        sessions.some(function (s) {
          //Find sessionsCompleted
          var done = resultSessions.filter(uSess => uSess.idSession == s.idSession && uSess.isSessionCompleted);
          if (done.length == 0) {
            this.setState({
              isCompletedSessionIntro: false
            });
            return true;
          } else
            return false;
        }.bind(this));
        if (this.state.isCompletedSessionIntro) //radom free course
          this.setState({ featuredCourse: this.state.freeCourses[Math.floor(Math.random() * this.state.length)] });
      }
    }
  };

  _getPremiumUser = async () => {
    console.ignoredYellowBox = ['Setting a timer'];
    result = await _readUserData();
    if (result != null) {
      this.setState({
        isPremiumUser: result.isPremium
      })
    }
  }

  _onClickFeatured = async () => {
    this.props.navigation.navigate('DetailScreen', {
      Name: this.state.featuredCourse.courseName,
      Description: this.state.featuredCourse.courseDescription,
      isPathRequire: this.state.featuredCourse.isPathRequire,
      TotalDuration: this.state.featuredCourse.totalDuration,
      ImageUrl: this.state.featuredCourse.imageUrl,
      Sessions: this.state.featuredCourse.sessions,
      isFreeTime: false,
      UserSessions: this.state.userSessions,
      isPremium: false
    });
  }

  _onClickList = async (data) => {
    this.props.navigation.navigate('DetailScreen', {
      Name: data.courseName,
      Description: data.courseDescription,
      isPathRequire: data.isPathRequire,
      TotalDuration: data.totalDuration,
      ImageUrl: data.imageUrl,
      Sessions: data.sessions,
      isFreeTime: false,
      UserSessions: this.state.userSessions,
      isPremium: data.isPremium
    });
  }

  _onClickListPremium = async (data) => {
    this.props.navigation.navigate('DetailScreen', {
      Name: data.courseName,
      Description: data.courseDescription,
      isPathRequire: data.isPathRequire,
      ImageUrl: data.imageUrl,
      Sessions: data.sessions,
      isFreeTime: false,
      isPremium: data.isPremium,
      UserSessions: this.state.userSessions
    });
  }

  _onClickFreeMeditation = async () => {
    this.props.navigation.navigate('DetailScreen', {
      Name: freeWayMeditation.name,
      Description: freeWayMeditation.description,
      isPathRequire: true,
      ImageUrl: freeWayMeditation.imageUrl,
      Sessions: [],
      isFreeTime: true,
      isPremium: false,
      UserSessions: this.state.userSessions
    });
  }

  render() {
    if (this.state.freeCourses.length > 0 &&
      this.state.premiumCourses.length > 0 &&
      this.state.featuredCourse != null) {
      return (
        <ScrollView>
          <View style={baseStyles.headerHome} >
            <Image source={require('app/src/Images/logo.png')} width={120} />
          </View>
          <View style={baseStyles.container}>

            <Text style={baseStyles.h2}>Mis primeros minutos meditando</Text>
            <FlatList
              horizontal
              data={this.state.quickStartCourses}
              renderItem={({ item: rowData }) => {
                return (
                  <View style={[baseStyles.borderRounded, { marginRight: 10 }]}>
                    <Tile
                      imageSrc={{ uri: rowData.imageUrl }}
                      title={rowData.courseName}
                      featured
                      onPress={() => this._onClickList(rowData)}
                      width={200}
                      height={100}
                      activeOpacity={0.8}
                      titleStyle={[baseStyles.tileTitle, { fontSize: 18, marginTop: 30 }]}
                      captionStyle={baseStyles.tileCaption}
                    />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />

            <Text style={baseStyles.h2}>Curso gratis de Pura Mente</Text>
            <View style={baseStyles.borderRounded}>
              <Tile
                imageSrc={{ uri: this.state.featuredCourse.imageUrl }}
                title={this.state.featuredCourse.courseName}
                titleStyle={baseStyles.tileTitle}
                captionStyle={baseStyles.tileCaption}
                featured
                caption={this.state.featuredCourse.courseDescription}
                onPress={() => this._onClickFeatured()}
                activeOpacity={0.8}
                width={DEVICE_WIDTH * 0.96}
                containerStyle={{ alignContent: "center" }}
              />
            </View>

            <Button
              onPress={() => this.props.navigation.navigate('SubscriptionScreen')}
              title="Accede a Pura Mente Premium"
              buttonStyle={baseStyles.subscribeButton}
              fontFamily={fonts.button}
              textStyle={baseStyles.subscribeButtonText}
              containerViewStyle={baseStyles.buttonContainer}
            />

            <Text style={baseStyles.h2}>Sesiones gratis</Text>
            <FlatList
              horizontal
              data={this.state.freeCourses}
              renderItem={({ item: rowData }) => {
                return (
                  <View style={[baseStyles.borderRounded, { marginRight: 10 }]}>
                    <Tile
                      imageSrc={{ uri: rowData.imageUrl }}
                      title={rowData.courseName}
                      featured
                      onPress={() => this._onClickList(rowData)}
                      width={200}
                      height={200}
                      activeOpacity={0.8}
                      titleStyle={[baseStyles.tileTitle, { fontSize: 18 }]}
                      captionStyle={baseStyles.tileCaption}
                    />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />

            <Text style={baseStyles.h2}>Meditar sin guía</Text>
            <View style={baseStyles.borderRounded}>
              <Tile
                imageSrc={{ uri: freeWayMeditation.imageUrl }}
                title={freeWayMeditation.name}
                featured
                caption={freeWayMeditation.description}
                titleStyle={baseStyles.tileTitle}
                captionStyle={baseStyles.tileCaption}
                onPress={() => this._onClickFreeMeditation()}
                width={DEVICE_WIDTH * 0.96}
                height={200}
                activeOpacity={0.8}
              />
            </View>

            <Text style={baseStyles.h2}>Cursos Premium</Text>
            <FlatList
              horizontal
              data={this.state.premiumCourses}
              renderItem={({ item: rowData }) => {
                return (
                  <View style={[baseStyles.borderRounded, { marginRight: 10 }]}>
                    <Tile
                      imageSrc={{ uri: rowData.imageUrl }}
                      title={rowData.courseName}
                      featured
                      onPress={() => this._onClickListPremium(rowData)}
                      width={200}
                      height={200}
                      activeOpacity={0.8}
                      titleStyle={[baseStyles.tileTitle, { fontSize: 18 }]}
                      captionStyle={baseStyles.tileCaption}
                    />
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />

            <Button
              onPress={() => this.props.navigation.navigate('SubscriptionScreen')}
              title="Accede a Pura Mente Premium"
              buttonStyle={baseStyles.subscribeButton}
              textStyle={baseStyles.subscribeButtonText}
              containerViewStyle={baseStyles.buttonContainer}
              fontFamily={fonts.button}
            />

          </View>
        </ScrollView>
      );
    } else {
      return (<Loading />);
    }
  }
}