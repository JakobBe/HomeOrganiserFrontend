import React, { Component } from 'react';
import { Text, View, ImageBackground } from 'react-native';
import { Footer, UserCarousel } from '../Common';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { colorPalette, deviceWidth, textStyles } from '../../Style';
import currentDate from '../../Helpers/currentDate';
import QRCode from 'react-native-qrcode-svg';

class Entry extends Component {
  state = {
    homeModalActive: false,
  }

  onModalClose = () => {
    this.props.homeContext.profileModal.close();
    // this.setState({
    //   profileModalActive: false,
    //   homeModalActive: false
    // });
  }

  completedSignUp = () => {
    this.setState({
      reload: !reload
    })
  }

  getQRCode = (id) => {
    return (
      <QRCode
        level="Q"
        style={styles.homeImg}
        value={JSON.stringify(
          id
        )}
      />
    )
  }

  getTodayEvents = () => {
    const selectedDateEvents = this.props.homeContext.events.filter(event => {
      if (event) {
        return event.date === currentDate() && event.userId === this.props.homeContext.currentUser.id
      }
      return undefined;
    });
    return selectedDateEvents;
  }

  renderMainContent = (currentUser, name, users, id) => {
    const profileColor = currentUser.color
    let userCarouselArray = users.filter(user => user.id !== currentUser.id);
    userCarouselArray.unshift(currentUser);
    const mate = this.props.homeContext.users.length === 2 ? 'roommate' : 'rommates';

    return (
      <View style={styles.mainContentContainer}>
        <View style={styles.homeWrapper}>
          <View>
            <Text style={textStyles.headerStyle}>
              {name}
            </Text>
            {/* <View style={styles.homeColorBlock(colorPalette.primary)}></View> */}
            <Text style={textStyles.normalText}>
              You have {this.props.homeContext.users.length - 1} {mate}.
            </Text>
          </View>
          {this.getQRCode(id)}
        </View>
        <UserCarousel
          userCarouselArray={userCarouselArray}
        />
      </View>
    );
  }

  render() {
    const {currentUser, users, name, id} = this.props.homeContext

    return (
    <ImageBackground
      source={require('../../../assets/images/real-aubergine.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.entryContainer}>
        {this.renderMainContent(currentUser, name, users, id)}
        <Footer isHomeActive={true} />
      </View>
    </ImageBackground>
    );
  }
};

const styles = {
  entryContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  mainContentContainer: {
    flex: 1,
  },

  homeWrapper: {
    height: '20%', 
    backgroundColor: 'rgba(255,255,255,.9)', 
    padding: 30,
    margin: 20, 
    borderRadius: 10,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  homeImg: {
    height: 60,
    width: 60,
  },

  homeColorBlock: (color) => ({
    backgroundColor: color,
    height: 15,
    width: '40%',
    marginBottom: 10
  }),

  backgroundImage: {
    width: '100%',
    height: '100%'
  }
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