import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

class ColorSlider extends Component {
  state = {
    r: 50,
    g: 50,
    b: 50
  }

  onRChnage = (value) => {
    this.setState({
      r: value
    })
  }

  onGChnage = (value) => {
    this.setState({
      g: value
    })
  }

  onBChnage = (value) => {
    this.setState({
      b: value
    })
  }

  render() {
    const {r, g, b} = this.state
    return (
      <View
        style={styles.colorSliderContainer(r, g, b)}
      >
        <Slider 
          onValueChange={(value) => this.onRChnage(value)}
          minimumValue={1}
          maximumValue={255}
          value={this.state.r}
        />
        <Slider
          onValueChange={(value) => this.onGChnage(value)}
          minimumValue={1}
          maximumValue={255}
          value={this.state.g}
        />
        <Slider
          onValueChange={(value) => this.onBChnage(value)}
          minimumValue={1}
          maximumValue={255}
          value={this.state.b}
        />
        <Button
          onPress={this.props.onColorSave}
        >
          Save
        </Button>
      </View>
    );
  }
} 

const styles = {
  colorSliderContainer: (r, g, b) => ({
    // height: 300,
    width: '100%',
    backgroundColor: `rgb(${r},${g},${b})`,
    padding: 20,
    borderRadius: 20
  })
}

export { ColorSlider };
