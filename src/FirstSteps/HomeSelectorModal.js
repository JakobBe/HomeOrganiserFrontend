import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Image } from 'react-native';
import { Button, Input, Spinner } from '../Common';
import { updateUser, createHome } from '../RailsClient';
import { colorPalette } from '../Style/Colors';

class ToDoFilterModal extends Component {
  state = {
    homeName: undefined,
    loading: false,
    error: ''
  };

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
      updateUser(this.props.user.id, this.props.user.color, this.props.user.link, homeId)
        .then((response) => response.json())
          .then((res) => {
            if (res.status === '200') {
              this.props.successfulHomeSelection(res.user);
            }
            if (res.status === '400') {
              this.setState({
                loading: false,
                error: 'Ups something went wrong. Please try again - maybe with a different name.'
              })
            }
          })
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
      const home = this.props.homes.filter(home => { return home.name === this.state.homeName})
      if (home.length > 0) {
        return home[0].id
      }
      return undefined;
    }

    if (this.props.createModalPresented) {
      return createHome(this.state.homeName).then((response) => response.json())
        .then((res) => {
          if (res.status === '200') {
            return res.home_id
          }
          if (res.status === '400') {
            return undefined;
          }
        })
    }
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

  render() {
    const buttonLabel = this.props.createModalPresented? 'Create Home' : 'Find Home'
    const infoText = this.getInfoText()

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.joinModalPresented || this.props.createModalPresented}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={() => this.props.onModalClose()}
          >
            <Image source={require('../../assets/images/close.png')} style={styles.imageStyle} />
          </TouchableOpacity>
          <Text style={styles.infoText}>
            {infoText}
          </Text>
          <Input placeholder='White House' onChangeText={name => {this.onChangeName(name)}} value={this.state.homeName}/>
          {this.renderSpinner()}
          <Button onPress={this.onButtonPress}>
            {buttonLabel}
          </Button>
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
  }
}

export default ToDoFilterModal;