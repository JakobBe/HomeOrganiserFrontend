import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Image, FlatList, Alert } from 'react-native';
import { Button, Input, Spinner } from '../Common';
import { updateUser } from '../../RailsClient';
import { colorPalette, textStyles } from '../../Style';
import { layouts } from '../../Style';
import { appSyncGraphQl } from '../../AWSClient';
import { createHome } from '../../graphql/Homes/mutations';
import { getUserBySub } from '../../graphql/Users/queries';
import moment from 'moment';
import { dateTimeFormat, invitationStatus } from '../../Helpers/magicNumbers';
import Camera from '../Common/Camera';
import { createInvitation, updateInvitation } from '../../graphql/Invitaions/mutations';

const inviteExceptions = {
  PendingInvitaionExsist: 1
};

class HomeSelectorModal extends Component {
  state = {
    homeName: undefined,
    loading: false,
    error: '',
    users: [],
    findDifferentPresented: true,
    cameraActive: false,
    visible: true
  };

  componentDidMount() {
    if (this.props.invitations && this.props.invitations.length > 0) {
      this.setState({
        findDifferentPresented: false
      });

      this.props.invitations.map(invitation => {
        const variables = {
          sub: invitation.creatorSub
        };

        appSyncGraphQl({ query: getUserBySub, variables })
          .then((res) => {
            if (res.status === 200) {
              const user = res.res.listUsers.items[0];
              let users = this.state.users;
              users.push(user);
              this.setState({
                users
              })
            }
            if (res.status === 400) {
              return undefined;
            }
          });
      });
    }
  }

  getInfoText = () => {
    if (this.props.createModalPresented) {
      return 'Please choose a unique name for your home.'
    }

    if (this.props.joinModalPresented) {
      return 'Please search for the name of the home you want to join'
    }
  }

  onButtonPress = async () => {
    this.setState({
      loading: true,
      error: ''
    });

    const homeId = await this.getHomeId()
    if (homeId !== undefined) {
      this.props.successfulHomeSelection(homeId);
    }

    if (homeId === undefined) {
      this.setState({
        loading: false,
        error: 'Ups something went wrong. Please try again - maybe with a different name.'
      })
    }
  };


  getHomeId = () => {
    if (this.props.joinModalPresented) {
      const homeName = this.props.homes.filter(home => { return home.name === this.state.homeName})
      if (homeName.length === 1) {
        return homeName[0].id
      }
      return undefined;
    }

    if (this.props.createModalPresented) {
      const variables = {
        input: {
          name: this.state.homeName,
          createdAt: moment.utc().format(dateTimeFormat),
          updatedAt: moment.utc().format(dateTimeFormat)
        }
      }

      console.log('variables', variables);
      return appSyncGraphQl({query: createHome, variables})
        .then((res) => {
          console.log('res from creating home', res);
          if (res.status === 200) {
            return res.res.createHome.id
          }
          if (res.status === 400) {
            return undefined;
          }
        })
    }
  }

  getUser = async (userSub) => {
    const variables = {
      sub: userSub
    };

    const user = await appSyncGraphQl({ query: getUserBySub, variables })
      .then((res) => {
        if (res.status === 200) {
          return res.res.listUsers.items[0]
        }
        if (res.status === 400) {
          return undefined;
        }
      });
    
    return user;
  }

  getPendingInvitations = (invitations) => {
    const extractKey = ({ id }) => id;

    const renderItem = ({item}) => {
      const home = this.props.homes.filter(home => { return home.id === item.homeId })[0];
      const creator = this.state.users.filter(user => { return user.sub === item.creatorSub })[0];
      const creatorName = creator !== undefined ? creator.name : "someone";
      console.log('creator', creator);
      return (
        <View style={styles.invitaionWrapper}>
          <Text style={textStyles.normalText}>
            You have an invitaion from {creatorName} to join {home.name}.
          </Text>
          <View style={styles.modalButtonsWrapper}>
            <Button
              additionalButtonStyles={{ backgroundColor: colorPalette.primary, width: '30%', padding: 0 }}
              additionalButtonTextStyles={{ color: colorPalette.secondary }}
            >
              Accept
            </Button>
            <Button
              additionalButtonStyles={{ width: '30%', padding: 0 }}
            >
              Decline
            </Button>
          </View>
        </View>
      );
    };

    return (
      <View>
        <FlatList
          data={invitations}
          renderItem={renderItem}
          keyExtractor={extractKey}
        />
      </View>
    );
  }

  onChangeName = (homeName) => {
    this.setState({
      homeName
    });
  };

  renderSpinner = () => {
    if (this.state.loading) {
      return <Spinner />
    };
    if (this.state.error) {
      return <Text style={styles.errorText} > {this.state.error} </Text>
    };
    return <View style={styles.spinnerPlaceholder}/>
  }

  findDifferentPress = () => {
    this.setState({
      findDifferentPresented: !this.state.findDifferentPresented
    });
  }

  onBarcodeDetected = (barcode) => {
    const home = this.props.homes.filter(home => { return home.id === barcode.data.split('"').join('') })[0];
    if (home && home.name) {
      this.setState({
        cameraActive: false
      });
      this.onInviteRequesTrigger(home);
    }
  }

  getCamera = () => {
    return (
      <Camera onBarcodeDetected={this.onBarcodeDetected}/>
    );
  }

  getJoinModalComponents = () => {
    const pendingInvitaion = this.props.invitations && !this.state.findDifferentPresented && !this.state.cameraActive ? this.getPendingInvitations(this.props.invitations) : undefined;
    const switchButton = this.props.invitations && !this.state.findDifferentPresented && !this.state.cameraActive ? <Button additionalButtonStyles={styles.additionalButtonStyles} additionalButtonTextStyles={styles.additionalButtonTextStyles} onPress={this.findDifferentPress}> Look for a different Home </Button> : <Button additionalButtonTextStyles={styles.additionalButtonTextStyles} additionalButtonStyles={styles.additionalButtonStyles} onPress={this.findDifferentPress}> See invitations </Button>;
    const input = this.state.findDifferentPresented && !this.state.cameraActive ? <Input label="Look for a Home by name" placeholder='White House' onChangeText={name => { this.onChangeName(name) }} value={this.state.homeName} /> : undefined;
    const qrButton = this.state.findDifferentPresented && !this.state.cameraActive ? 
      <View style={[layouts.centerWrapper, styles.qrScanWrapper]}>
        <TouchableOpacity onPress={() => this.setState({cameraActive: true}) } style={styles.qrScanButton}> 
          <Text style={textStyles.headerStyle}> Scan QR Code </Text>
        </TouchableOpacity>
      </View> : undefined;

    const findButton = this.state.findDifferentPresented && !this.state.cameraActive ? <Button onPress={this.onButtonPress}> Find Home </Button> : undefined;
    const camera = this.state.cameraActive ? this.getCamera() : undefined;

    return (
      <View style={styles.joinModalWrapper}>
        {camera}
        <View style={[layouts.centerWrapper, styles.switchButton]}>
          {switchButton}
        </View>
        {pendingInvitaion}
        {qrButton}
        {input}
        <View style={layouts.centerWrapper}>
          {findButton}
        </View>
        {/* { this.renderSpinner() } */}
      </View>
    );
  }

  inviteCheck = (inviteEmail) => {
    let checkStatus = undefined;
    const invitationExist = this.props.invitations.filter(invite => invite.email.toLowerCase() === inviteEmail.toLowerCase());
    checkStatus = invitationExist.length === 1 ? inviteExceptions.PendingInvitaionExsist : undefined;
    return checkStatus;
  }

  onInviteRequesTrigger = (home) => {
    const {email, sub} = this.props.user;
    const inviteCheckStatus = this.inviteCheck(email.toLowerCase());

    if (inviteCheckStatus === inviteExceptions.PendingInvitaionExsist) {
      Alert.alert("You already have a pending invitaion for this home.");
      return;
    }

    const variables = {
      input: {
        creatorSub: sub,
        homeId: home.id,
        request: true,
        status: invitationStatus.pending,
        email: email.toLowerCase(),
        createdAt: moment.utc().format(dateTimeFormat),
        updatedAt: moment.utc().format(dateTimeFormat)
      }
    };

    appSyncGraphQl({ query: createInvitation, variables })
      .then((res) => {
        if (res.status === 200) {
          Alert.alert(`Request was sent successfully to ${home.name}.`, '', [
            {
              text: 'Ok', onPress: () => {
                this.props.onModalClose();
              }
            }
          ]);
        }
      })
  }

  render() {
    const modalComponents = this.props.joinModalPresented ? this.getJoinModalComponents() : undefined;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={(this.props.joinModalPresented || this.props.createModalPresented) && this.state.visible}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => this.props.onModalClose()}
          >
            <Image source={require('../../../assets/images/close.png')} style={styles.imageStyle} />
          </TouchableOpacity>
          {modalComponents}
        </View>
      </Modal>
    );
  }
}

const styles = {
  modalContainer: {
    margin: 20,
    marginTop: 100,
    padding: 20,
    paddingTop: 40,
    widht: '100%',
    backgroundColor: 'rgba(255,255,255,.96)',
    borderRadius: 10,
    borderColor: colorPalette.secondary,
    borderStyle: 'solid',
    borderWidth: 1.5,
    position: 'relative',
    height: 400,
    color: colorPalette.primary,
    // flex: 0,
    // justifyContent: 'space-between'
  },

  imageStyle: {
    height: 25,
    width: 25,
    top: -15,
    left: '90%'
  },

  infoText: {
    color: colorPalette.secondary,
    fontSize: 18,
    letterSpacing: 1,
    marginBottom: 20
  },

  spinnerPlaceholder: {
    flex: 1
  },

  errorText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'left',
    letterSpacing: 1,
    color: 'red',
    flex: 1
  },

  invitaionWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'dotted',
    borderWidth: 1.5,
    borderRadius: 10,
  },

  modalButtonsWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10
  },

  switchButton: {
    position: 'absolute',
    top: -50,
    left: -5
  },

  qrScanWrapper: {
    margin: 40,
  },
  
  qrScanButton: {
    borderColor: colorPalette.primary,
    borderStyle: 'dashed',
    borderWidth: 4,
    borderRadius: 4,
    padding: 10
  },

  additionalButtonStyles: {
    backgroundColor: 'white',
    // borderColor: colorPalette.secondary,
    // borderStyle: 'solid',
    // borderWidth: 2,
    width: '100%'
  },

  additionalButtonTextStyles: {
    color: colorPalette.secondary,
    textDecorationLine: 'underline',
    textDecorationColor: colorPalette.secondary,
  },

  joinModalWrapper: {
    flex: 1,
    height: '100%',
  }
}

export default HomeSelectorModal;