import React from 'react';
import { View, Modal, Alert, FlatList, Text } from 'react-native';
import { colorPalette, deviceWidth, textStyles, layouts } from '../../Style';
import { Button, CloseButton, Input } from '../Common';
import { createInvitation, updateInvitation } from '../../graphql/Invitaions/mutations';
import { dateTimeFormat, invitaionStatus } from '../../Helpers/magicNumbers';
import { appSyncGraphQl } from '../../AWSClient';
import moment from 'moment';

const inviteExceptions = {
  PendingInvitaionExsist: 1
}

class InvitaionModal extends React.Component {
  state = {
    inviteEmail: ''
  }

  inviteCheck = (inviteEmail) => {
    let checkStatus = undefined;
    const invitationExist = this.props.invitations.filter(invite => invite.email.toLowerCase() === inviteEmail.toLowerCase());
    checkStatus = invitationExist.length === 1 ? inviteExceptions.PendingInvitaionExsist : undefined;
    return checkStatus;
  }

  onInviteSendPress = () => {
    const {inviteEmail} = this.state;

    const inviteCheckStatus = this.inviteCheck(inviteEmail);

    if (inviteCheckStatus === inviteExceptions.PendingInvitaionExsist) {
      Alert.alert("There already is a pending invitaion for this email.");
      return;
    }

    const variables = {
      input: {
        creatorSub: this.props.creatorSub,
        homeId: this.props.homeId,
        request: false,
        status: invitaionStatus.pending,
        email: inviteEmail,
        createdAt: moment.utc().format(dateTimeFormat),
        updatedAt: moment.utc().format(dateTimeFormat)
      }
    };

    appSyncGraphQl({query: createInvitation, variables})
      .then((res) => {
        if (res.status === 200) {
          Alert.alert("Invitaion was sent successfully.", '', [
            { text: 'Ok', onPress: () => {
              this.setState({
                inviteEmail: '',
              });
              this.props.onModalClose();
            }}
          ]);
        }
      })
  }

  onRemovePress = (itemId) => {
    const variables = {
      input: {
        id: itemId,
        status: invitaionStatus.declined,
        updatedAt: moment.utc().format(dateTimeFormat)
      }
    };

    appSyncGraphQl({query: updateInvitation, variables})
      .then((res) => {
        if (res.status === 200) {
          Alert.alert("Invitaion removed successfully.", '', [
            {
              text: 'Ok', onPress: () => {
                this.props.onModalClose();
              }
            }
          ]);
        }
      })
  }

  renderItem = ({item}) => {
    const button = item.request ? 
    (
      <View style={styles.modalButtonsWrapper}>
        <Button
            additionalButtonStyles={{ backgroundColor: colorPalette.primary, width: '30%', padding: 0, flex: 1 }}
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
    ) : (
      <View style={styles.modalButtonsWrapper}>
        <Button
            additionalButtonStyles={{ backgroundColor: colorPalette.red, width: '30%', padding: 0}}
          onPress={() => this.onRemovePress(item.id)}
        >
          Remove
      </Button>
      </View>
    )

    return (
      <View style={styles.invitationItemWrapper}> 
        <Text style={textStyles.normalText}>
          {item.email}
        </Text>
        {button}
      </View>
    );
  }

  getModal = () => {
    const extractKey = ({ id }) => id;
    const modalContent = this.props.isInviteModal ?
      (
        <View>
          <Input
            label='An invitaion will be send to this email.'
            placeholder='your@friend.com'
            onChangeText={inviteEmail => this.setState({ inviteEmail })}
            value={this.state.inviteEmail}
            keyboardType={'email-address'}
          />
          <View style={layouts.centerWrapper}>
            <Button
              onPress={this.onInviteSendPress}
              additionalButtonStyles={{ backgroundColor: colorPalette.primary, marginTop: 30, marginBottom: 20 }}
              additionalButtonTextStyles={{ color: colorPalette.secondary }}
            >
              Send Invitaion
            </Button>
          </View>
        </View>
      ) : (
        <FlatList
          // style={styles.flatList}
          data={this.props.invitations}
          renderItem={this.renderItem}
          keyExtractor={extractKey}
        />
      );

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalActive}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.modalContainer}>
            <CloseButton onPress={this.props.onModalClose} />
            {modalContent}
          </View>
        </View>
      </Modal>
    )
  }

  render() {
    return (
      this.getModal()
    );
  }
}

export default InvitaionModal;

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  modalContainer: {
    margin: 30,
    marginTop: 110,
    marginBottom: 110,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between'
  },

  invitationItemWrapper: {
    flex: 0,
    // flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: 'rgba(200,200,200,.8)',
    margin: 10,
    padding: 10,
    alignItems: 'center'
  },

  invitationEmail: {

  },

  modalButtonsWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 10

    // alignSelf: 'flex-end'
  }
};