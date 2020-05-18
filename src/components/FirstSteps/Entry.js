import React, { Component } from 'react';
import { Text, View, ImageBackground, Modal } from 'react-native';
import { Footer, UserCarousel, Button, CloseButton, Input } from '../Common';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { colorPalette, deviceWidth, textStyles, layouts } from '../../Style';
import currentDate from '../../Helpers/currentDate';
import QRCode from 'react-native-qrcode-svg';
import InvitaionModal from './InvitaionModal';

class Entry extends Component {
  state = {
    modalActive: false,
    isInviteModal: false
  }

  onModalClose = () => {
    this.props.homeContext.updateInvitations();
    this.setState({
      modalActive: false,
      isInviteModal: false
    });
  }

  completedSignUp = () => {
    this.setState({
      reload: !reload
    })
  }

  getQRCode = (id) => {
    return (
      <QRCode
        size={50}
        logo={{uri: '../../../assets/images/eggplant_single.png'}}
        logoSize={10}
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

  getPendingRequestButton = (invitations) => {
    console.log('invitations', invitations);
    if (invitations && invitations.length > 0) {
      return (
        <Button
          onPress={() => this.setState({ modalActive: true })}
        >
          Pending Requests
        </Button>
      );
    }
  }

  renderMainContent = (currentUser, name, users, id, invitations) => {
    let userCarouselArray = users.filter(user => user.id !== currentUser.id);
    userCarouselArray.unshift(currentUser);
    const mate = this.props.homeContext.users.length === 2 ? 'roommate' : 'rommates';

    return (
      <View style={styles.mainContentContainer}>
        <View style={styles.homeContainer}>
          <View style={styles.homeInfoWrapper}>
            <View>
              <Text style={textStyles.headerStyle}>
                {name}
              </Text>
              <Text style={textStyles.normalText}>
                You have {this.props.homeContext.users.length - 1} {mate}.
              </Text>
            </View>
            {this.getQRCode(id)}
          </View>
          <View style={layouts.centerWrapper}>
            <Button 
              onPress={() => this.setState({ modalActive: true, isInviteModal: true })}
              additionalButtonStyles={{margin: 10}}
            >
              Invite friend
            </Button>
            <InvitaionModal
              modalActive={this.state.modalActive}
              isInviteModal={this.state.isInviteModal}
              onModalClose={this.onModalClose}
              creatorSub={currentUser.sub}
              invitations={invitations}
              homeId={id}
              updateInvitations={this.props.homeContext.updateInvitations}
            />
            {this.getPendingRequestButton(invitations)}
          </View>
        </View>
        <UserCarousel
          userCarouselArray={userCarouselArray}
        />
      </View>
    );
  }

  render() {
    const {currentUser, users, name, id, invitations} = this.props.homeContext
    console.log('users', users);
    return (
    <ImageBackground
      source={require('../../../assets/images/real-aubergine.jpg')}
      style={styles.backgroundImage}
    >
      <View style={styles.entryContainer}>
        {this.renderMainContent(currentUser, name, users, id, invitations)}
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

  backgroundImage: {
    width: '100%',
    height: '100%'
  },

  mainContentContainer: {
    flex: 1,
  },

  homeInfoWrapper: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  homeContainer: {
    height: '30%',
    backgroundColor: 'rgba(255,255,255,.9)',
    padding: 30,
    margin: 20,
    borderRadius: 10,
    flex: 0,
    justifyContent: 'space-between'
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