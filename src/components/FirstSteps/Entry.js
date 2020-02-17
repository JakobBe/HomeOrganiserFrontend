import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Footer, BackgroundCarousel } from '../Common';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import HomeSelector from './HomeSelector';
import { colorPalette, deviceWidth } from '../../Style';
import ProfileModal from './ProfileModal';
import HomeModal from './HomeModal';

class Entry extends Component {
  state = {
    imageUp: false,
    profileModalActive: false,
    homeModalActive: false
  }

  onSwipeUp = (gestureState) => {
    this.setState({
      imageUp: true
    })
  }

  onSwipeDown = (gestureState) => {
    this.setState({
      imageUp: false
    })
  }

  onProfilePress = async () => {
    this.setState({
      profileModalActive: true
    });
  }

  onHomePress = () => {
    this.setState({
      homeModalActive: true
    });
  }

  onModalClose = () => {
    this.setState({
      profileModalActive: false,
      homeModalActive: false
    });
  }

  getTodayEvents = () => {
    let selectedDateEvents = this.props.homeContext.events.filter(event => {
      return event.date === this.currentDate()
    });
    return selectedDateEvents;
  }

  currentDate = () => {
    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    if (month.toString().length === 1) {
      month = `0${month}`
    }

    if (day.toString().length === 1) {
      day = `0${day}`
    }

    const today = `${year}-${month}-${day}`;
    return today
  }

  renderMainContent = (currentUser) => {
    const images = ['https://picsum.photos/id/100/1000/1000', 'https://picsum.photos/id/253/1000/1000', 'https://picsum.photos/id/137/1000/1000', 'https://picsum.photos/id/25/1000/1000', 'https://picsum.photos/id/431/1000/1000', 'https://picsum.photos/id/311/1000/1000'];
    const profileColor = currentUser.color
    const users = this.props.homeContext.users;
    return (
      <View>
        {/* <View style={styles.carouselWrapper}>
          <BackgroundCarousel 
            images={images} 
          />
        </View> */}
        <View style={styles.guideWrapper}>
          <TouchableOpacity style={styles.imageWrapper(profileColor)} onPress={this.onProfilePress}>
            <Text style={{ color: colorPalette.primary }}>Profile settings</Text>
            <Image source={require('../../../assets/images/user-black-c.png')} style={styles.imageStyle} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageWrapper('white')} onPress={this.onHomePress}>
            <Text style={{ color: colorPalette.primary }}>Home settings</Text>
            <Image source={require('../../../assets/images/group-c.png')} style={styles.imageStyle} />
          </TouchableOpacity>
        </View>
        <View style={styles.guideWrapper}>
          <View style={styles.imageWrapper('white')}>
            <Text style={{ color: colorPalette.primary }}>Your Balance</Text>
            <Text style={{ color: colorPalette.primary }}>+100$</Text>
          </View>
          <View style={styles.imageWrapper('white')}>
            <Text style={{ color: colorPalette.primary }}>Events today</Text>
            {/* <Text style={{ color: colorPalette.primary, textAlign: 'center',  }}>{this.getTodayEvents()[0].text}</Text> */}
          </View>
        </View>
        {/* <GestureRecognizer
          onSwipeUp={(state) => this.onSwipeUp(state)}
          onSwipeDown={(state) => this.onSwipeDown(state)}
        >
          <Image source={require('../../assets/images/eggplant.png')} style={styles.imageStyle(this.state.imageUp)} />
        </GestureRecognizer> */}
        {/* <View style={styles.flatmatesContainer}>
          <Text style={styles.greeting}>
            Hi {this.props.homeContext.currentUser.name}, these are your flatmates.
          </Text>
          <View style={styles.userLetterWrapper}>
            {users.map(user => (
              <View style={styles.userLetterStyleContainer(user.color || 'black')}>
                <Text style={styles.userLetterStyle}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View> */}
        <ProfileModal 
          profileModalActive={this.state.profileModalActive}
          onModalClose={this.onModalClose}
        />
        <HomeModal
          homeModalActive={this.state.homeModalActive}
          onModalClose={this.onModalClose}
        />
      </View>
    );
  }

  render() {
    const currentUser = this.props.homeContext.currentUser

    if (currentUser) {
      return (
        <View style={styles.entryContainer}>
          {this.renderMainContent(currentUser)}
          <Footer isHomeActive={true} />
        </View>
      );
    }

    return (
      <View style={styles.entryContainer}>
        <HomeSelector />
      </View>
    );
  }
};

const styles = {
  titleStyle: {
    fontSize: 18,
    paddingLeft: 15,
    marginTop: 20
  },

  entryContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },

  carouselWrapper: {
    height: '60%'
  },

  greeting: {
    fontSize: 18,
    margin: 20,
    fontWeight: '600'
  },

  imageStyle: {
    height: 60,
    width: 60,
    alignSelf: 'center',
    marginTop: 20
  },

  userLetterStyleContainer: (color) => ({
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    backgroundColor: color,
    justifyContent: 'center'
  }),

  userLetterStyle: {
    color: 'white',
    textAlign: 'center',
  },

  userLetterWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },

  guideWrapper: {
    margin: 20,
    marginBottom: 0,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  imageWrapper: (backgroundColor) => ({
    flex: 0,
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colorPalette.secondary,
    backgroundColor: colorPalette.secondary,
    height: deviceWidth/2.5,
    width: deviceWidth/2.5
  }),
};

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <Entry {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);