import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert } from 'react-native';
import { Button } from './Button';
import { Input } from './Input';

class CommonModal extends Component {  
  state = {
    newEvent: ''
  };
  
  onSaveButtonPress = () => {
    if (this.props.singleEventId) {
      this.props.saveInput(this.state.newEvent, this.props.singleEventId), this.setState({ newEvent: '' })
      return
    }
    this.props.saveInput(this.state.newEvent), this.setState({ newEvent: '' })
  }

  render() {
    const value = this.state.newEvent || this.props.modalValue
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.modalContainer}>
          <TouchableHighlight
            onPress={() => { this.props.onModalClose(), this.setState({newEvent: '' })} }
            style={{ top: 3, left: '85%'}}
          >
            <Text style={{ color: '#a9eec2', fontWeight: 'bold' }}>Close</Text>
          </TouchableHighlight>
          <Input
            value={value}
            onChangeText={value => this.setState({ newEvent: value })}
            placeholder={'Enter a new event'}
            autoFocus={true}
          />
          <Button 
            onPress={() => this.onSaveButtonPress()}
            additionalButtonStyles={styles.buttonStyle}
          >
            Save
          </Button>
        </View>
      </Modal>
    );
  }
}

const styles = {
  modalContainer: {
    margin: 30, 
    marginTop: 110, 
    marginBottom: 110, 
    backgroundColor: 'rgb(255,255,255)', 
    widht: '100%', 
    borderRadius: 10, 
    borderColor: '#a9eec2', 
    borderStyle: 'solid', 
    borderWidth: 1.5, 
    padding: 20, 
    position: 'relative', 
    flex: 0, 
    justifyContent: 'space-between'
  },

  buttonStyle: {
    backgroundColor: '#05004e',
    marginTop: 5
  }
}

export { CommonModal };