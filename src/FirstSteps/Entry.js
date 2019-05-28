import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { Footer } from '../common';
import Login from './Login';
import SignUp from './SignUp';
import { UserContext } from '../contexts/UserContextHolder';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

class Entry extends Component {
  state = {
    user: this.props.userContext.user || {},
    isSignUpActive: false,
    imageUp: false
  }

  hasSignedIn = (user) => {
    this.setState({
      user,
      isSignUpActive: false
    });
  };

  renderLogin = () => {
    if (Object.entries(this.state.user).length === 0 && !this.state.isSignUpActive) {
      return (
        <Login 
          hasSignedIn={this.hasSignedIn}
          navigateLogin={this.navigateLogin}
        />
      );
    };
  };

  renderSignUp = () => {
    if (this.state.isSignUpActive) {
      return (
        <SignUp 
          hasSignedIn={this.hasSignedIn}
          navigateLogin={this.navigateLogin}
        />
      );
    };
  };

  navigateLogin = () => {
    this.setState({
      isSignUpActive: !this.state.isSignUpActive
    });
  };

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

  renderMainContent = () => {
    if (Object.entries(this.state.user).length > 0) {
      return (
        <View>
          <GestureRecognizer
            onSwipeUp={(state) => this.onSwipeUp(state)}
            onSwipeDown={(state) => this.onSwipeDown(state)}
          >
            <Image source={require('../../assets/images/koi.jpg')} style={styles.imageStyle(this.state.imageUp)} />
          </GestureRecognizer>
          <Text>
            Hello {this.state.user.name}
          </Text>
        </View>
      );
    };
  }

  renderFooter = () => {
    if (Object.entries(this.state.user).length > 0) {
      return (
        <Footer />
      );
    };
  }

  render() {
    // const toDoList = this.setToDoList()
    return (
      <View style={styles.entryContainer}>
        {this.renderLogin()}
        {this.renderSignUp()}
        {this.renderMainContent()}
        {this.renderFooter()}
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
    backgroundColor: 'rgb(255,255,255)'
  },

  imageStyle: (imageUp) => ({
    width: 400,
    height: imageUp ? 100 : 400
  })
};

export default (props) => (
  <UserContext.Consumer>
    {userContext => <Entry {...props} userContext={userContext} />}
  </UserContext.Consumer>
);