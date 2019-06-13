import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, Alert, Picker } from 'react-native';
import { Button } from './Button';
import { Input } from './Input';

class CommonModal extends Component {  
  state = {
    newEvent: '',
    hour: undefined,
    minute: undefined
  };
  
  onSaveButtonPress = () => {
  const { newEvent, hour, minute } = this.state;
    if (this.props.singleEventId) {
      this.props.saveInput(newEvent, hour, minute, this.props.singleEventId), this.setState({ newEvent: '' })
      return
    }
    this.props.saveInput(newEvent, hour, minute), this.setState({ newEvent: '' }, )
  }

  getHourPickerItems = () => {
    const hours = Array.from({ length: 24 }, (v, k) => (k).toString()); 

    return hours.map(hour => {
      return (
        <Picker.Item label={hour} value={hour} style={{ color: '#05004e' }}/>
      );
    });
  }

  getMinutePickerItems = () => {
    const minutes = Array.from({ length: 60}, (v, k) => (k).toString()); 

    return minutes.map(minute => {
      return (
        <Picker.Item label={minute} value={minute} style={{ color: '#05004e' }} />
      );
    });
  }

  render() {
    const value = this.state.newEvent || this.props.modalValue
    const hourPickerItems = this.getHourPickerItems()
    const minutePickerItems = this.getMinutePickerItems()
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
          <View style={styles.timePickerWrapper}>
            <Picker
              selectedValue={this.state.hour}
              onValueChange={value => this.setState({ hour: value })}
              style={{ height: 200, backgroundColor: 'white', width: 80, color: '#05004e' }}
              itemStyle={{ height: 200 }}
            >
              {hourPickerItems}
            </Picker>
            <Text style={{ fontSize: 30, color: '#05004e'}}>:</Text>
            <Picker
              selectedValue={this.state.minute}
              onValueChange={value => this.setState({ minute: value })}
              style={{ height: 200, backgroundColor: 'white', width: 80, color: '#05004e' }}
              itemStyle={{ height: 200 }}
            >
              {minutePickerItems}
            </Picker>
          </View>
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
  },

  timePickerWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  }
}

export { CommonModal };