import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Modal, Image } from 'react-native';
import { Input, Button } from '../Common';
import { colorPalette, deviceWidth, deviceHeight, layouts } from '../../Style';
import { getPreSignedUrl, appSyncGraphQl, confirmUser } from '../../AWSClient';

class EmailVerificationModal extends Component {
  state = {
    inputFieldOne: '',
    inputFieldTwo: '',
    inputFieldThree: '',
    inputFieldFour: '',
    inputFieldFive: '',
    inputFieldSix: '',
    verificationCode: ''
  }

  componentDidUpdate() {
    const { inputFieldOne, inputFieldTwo, inputFieldThree, inputFieldFour, inputFieldFive, inputFieldSix } = this.state;
    const verificationCode = `${inputFieldOne}${inputFieldTwo}${inputFieldThree}${inputFieldFour}${inputFieldFive}${inputFieldSix}`
    if (verificationCode.length === 6) {
      this.confirmUser(verificationCode);
    }
  }

  confirmUser = async (verificationCode) => {
    const confirmation = await confirmUser(this.props.sub, verificationCode);
    if (confirmation.res === 'SUCCESS') {
      await this.props.hasSignedUp(this.props.sub);
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.transparentBackground}>
          <TouchableOpacity
            onPress={() => {
              this.props.onModalClose()
            }
            }
          >
            <Image source={require('../../../assets/images/close-primary.png')} style={styles.closeImageStyle} />
          </TouchableOpacity>
          <Text style={styles.textStyle}>
            Please verify your email address with the 6-digit code that was sent to you.
          </Text>
          <View style={styles.inputWrapper}>
            <Input
              value={this.state.inputFieldOne}
              onChangeText={
                value => {this.setState({ inputFieldOne: value })
                  if (value.length === 1) {
                    this.refTwoInput.focus()
                  }
                }
              }
              additionalTextFieldStyle={styles.additionalTextInputStyles}
              additionalInputStyles={styles.additionalInputStyles}
              autoFocus={true}
              keyboardType={'numeric'}
              maxLength={1}
              newRef={(refOne) => { this.refOneInput = refOne }}
            />
            <Input
              value={this.state.inputFieldTwo}
              onChangeText={
                value => {this.setState({ inputFieldTwo: value })
                  if (value.length === 1) {
                    this.refThreeInput.focus()
                  }
                }
              }
              additionalTextFieldStyle={styles.additionalTextInputStyles}
              additionalInputStyles={styles.additionalInputStyles}
              keyboardType={'numeric'}
              maxLength={1}
              newRef={(refTwo) => {this.refTwoInput = refTwo}}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && this.state.inputFieldTwo.length === 0) {
                  this.refOneInput.focus();
                }
              }}
            />
            <Input
              value={this.state.inputFieldThree}
              onChangeText={
                value => {this.setState({ inputFieldThree: value })
                  if (value.length === 1) {
                    this.refFourInput.focus()
                  }
                }
              }
              additionalTextFieldStyle={styles.additionalTextInputStyles}
              additionalInputStyles={styles.additionalInputStyles}
              keyboardType={'numeric'}
              maxLength={1}
              newRef={(refThree) => { this.refThreeInput = refThree }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && this.state.inputFieldThree.length === 0) {
                  this.refTwoInput.focus();
                }
              }}
            />
            <Input
              value={this.state.inputFieldFour}
              onChangeText={
                value => {this.setState({ inputFieldFour: value })
                  if (value.length === 1) {
                    this.refFiveInput.focus()
                  }
                }
              }
              additionalTextFieldStyle={styles.additionalTextInputStyles}
              additionalInputStyles={styles.additionalInputStyles}
              keyboardType={'numeric'}
              maxLength={1}
              newRef={(refFour) => { this.refFourInput = refFour }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && this.state.inputFieldFour.length === 0) {
                  this.refThreeInput.focus();
                }
              }}
            />
            <Input
              value={this.state.inputFieldFive}
              onChangeText={
                value => {this.setState({ inputFieldFive: value })
                  if (value.length === 1) {
                    this.refSixInput.focus()
                  }
                }
              }
              additionalTextFieldStyle={styles.additionalTextInputStyles}
              additionalInputStyles={styles.additionalInputStyles}
              keyboardType={'numeric'}
              maxLength={1}
              newRef={(refFive) => { this.refFiveInput = refFive }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && this.state.inputFieldFive.length === 0) {
                  this.refFourInput.focus();
                }
              }}
            />
            <Input
              value={this.state.inputFieldSix}
              onChangeText={
                value => {this.setState({ inputFieldSix: value })
                }
              }
              additionalTextFieldStyle={styles.additionalTextInputStyles}
              additionalInputStyles={styles.additionalInputStyles}
              keyboardType={'numeric'}
              maxLength={1}
              newRef={(refSix) => { this.refSixInput = refSix }}
              onKeyPress={({ nativeEvent }) => {
                if (nativeEvent.key === 'Backspace' && this.state.inputFieldSix.length === 0) {
                  this.refFiveInput.focus();
                }
              }}
                  />
          </View>
        </View>
      </Modal>
    );
  };
};

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(20,20,20,.97)',
    flex: 0,
    justifyContent: 'space-around',
    position: 'relative'
  },

  textStyle: {
    margin: 20,
    marginTop: '25%',
    fontSize: 20,
    color: 'white',
    lineHeight: 35,
    letterSpacing: 3
  },

  additionalTextInputStyles : { 
    backgroundColor: 'transparent', 
    paddingLeft: 5, 
    paddingRight: 0, 
    color: 'white', 
    fontSize: 25 
  },

  inputWrapper: {
    backgroundColor: 'transparent',
    flex: 1,
    padding: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: '25%'
  },

  closeImageStyle: {
    height: 25,
    width: 25,
    top: 30,
    left: '90%'
  },

  additionalInputStyles: {
    width: 30
  }
};

export default EmailVerificationModal;