import React, { Component } from 'react';
import { View, Dimensions, ScrollView, ImageBackground } from 'react-native';
import { HomeContext } from '../../contexts/HomeContextHolder';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette } from '../../Style';

class Arrival extends Component {
  state = {
    isSignUpActive: false,
  }

  hasSignedIn = async (sub) => {
    const currentUser = await this.props.homeContext.createUserSession(sub);
    if (currentUser) {
      await this.props.homeContext.buildHomeContext(currentUser.homeId);
    } else {
      this.props.homeContext.updateSub(sub)
    }
    Actions.entry({ type: ActionConst.REPLACE })
  };

  hasSignedUp = async (sub) => {
    this.props.homeContext.updateSub(sub)
    Actions.entry({ type: ActionConst.REPLACE })
  };

  renderSignIn = () => {
    if (!this.state.isSignUpActive) {
      return (
        <SignIn 
          hasSignedIn={this.hasSignedIn}
          navigateSignIn={this.navigateSignIn}
          hasSignedUp={this.hasSignedUp}
        />
      );
    };
  };

  renderSignUp = () => {
    if (this.state.isSignUpActive) {
      return (
        <SignUp 
          hasSignedUp={this.hasSignedUp}
          navigateSignIn={this.navigateSignIn}
        />
      );
    };
  };

  navigateSignIn = () => {
    this.setState({
      isSignUpActive: !this.state.isSignUpActive
    });
  };

  render() {
    const deviceHeight = Dimensions.get('window').height

    // { uri: 'https://picsum.photos/id/57/2448/3264' }
    return (
      <View style={styles.arrivalContainer()}>
        <ImageBackground 
          source={require('../../../assets/images/real-aubergine.jpg')}
          style={styles.backgroundImage}
        >
          <View style={styles.scrollViewWrapper(deviceHeight)}>
            <ScrollView 
              keyboardDismissMode={'on-drag'}
            >
              {this.renderSignIn()}
              {this.renderSignUp()}
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    )
  }
};

const styles = {
  scrollViewWrapper: (deviceHeight) => ({
    height: deviceHeight / 2.2,
    backgroundColor: 'rgba(255,255,255,.9)',
    margin: 20,
    marginTop: deviceHeight / 10,
    borderRadius: 20,
    padding: 20
  }),

  arrivalContainer: () => ({
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: colorPalette.primary
  }),

  backgroundImage: {
    width: '100%',
    height: '100%'
  }
};

export default (props) => (
  <HomeContext.Consumer>
    {homeContext => <Arrival {...props} homeContext={homeContext} />}
  </HomeContext.Consumer>
);