import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { Footer, BackgroundCarousel } from '../Common';
import { UserContext } from '../contexts/UserContextHolder';
import { HomeContext } from '../contexts/HomeContextHolder';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import HomeSelector from './HomeSelector';
import { colorPalette } from '../Style';
import ProfileModal from './ProfileModal';
import ImagePicker from 'react-native-image-picker';
import { getPreSignedUrl } from '../AWSClient';

class Entry extends Component {
  state = {
    imageUp: false,
    profileModalActive: false
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
    const options = {
      title: 'Select Profile Picture',
      customButtons: [{ name: 'random', title: 'Get a random picture :)' }],
    };
    const preSignedUrl = await getPreSignedUrl();

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('preSignedUrl', preSignedUrl);
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', preSignedUrl);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('Image successfully uploaded to S3', xhr);
            }
          } else {
            console.log('Error while sending the image to S3', xhr);
          }
        }
        xhr.setRequestHeader('Content-Type', 'image/jpeg');
        xhr.send({ uri: response.uri, type: 'image/jpeg', name: 'test.jpg' });
      }
    });
  }

  onModalClose = () => {
    this.setState({
      profileModalActive: false
    });
  }

  renderHomeSelector = (isNewUser) => {
    if (isNewUser) {
      return (
        <HomeSelector />
      );
    }
  }

  renderMainContent = (isNewUser, currentUser) => {
    const images = ['https://picsum.photos/id/100/1000/1000', 'https://picsum.photos/id/253/1000/1000', 'https://picsum.photos/id/137/1000/1000', 'https://picsum.photos/id/25/1000/1000', 'https://picsum.photos/id/431/1000/1000', 'https://picsum.photos/id/311/1000/1000'];
    const profileColor = currentUser.color
    const users = this.props.homeContext.users;
    if (!isNewUser) {
      return (
        <View>
          <View style={styles.carouselWrapper}>
            <BackgroundCarousel 
              images={images} 
            />
          </View>
          <View style={styles.guideWrapper}>
            <TouchableOpacity style={styles.imageWrapper(profileColor)} onPress={this.onProfilePress}>
              <Image source={require('../../assets/images/user-black.png')} style={styles.imageStyle} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageWrapper('white')}>
              <Image source={require('../../assets/images/eggplant_double.png')} style={styles.imageStyle} />
            </TouchableOpacity>
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
        </View>
      );
    }
  }

  renderFooter = (isNewUser) => {
    if (!isNewUser) {
      return (
        <Footer isHomeActive={true}/>
      );
    }
  }

  render() {
    const currentUser = this.props.homeContext.currentUser
    const isNewUser = currentUser.home_id === 42 ? true : false;

    return (
      <View style={styles.entryContainer}>
        {this.renderHomeSelector(isNewUser)}
        {this.renderMainContent(isNewUser, currentUser)}
        {this.renderFooter(isNewUser)}
      </View>
    )
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
    height: 40,
    width: 40
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
    margin: 40,
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
    backgroundColor
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