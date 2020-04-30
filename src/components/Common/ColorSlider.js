import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import Slider from '@react-native-community/slider';
import { Button } from './Button';
import { layouts } from '../../Style';

class ColorSlider extends Component {
  state = {
    r: 0,
    g: 0,
    b: 0
  }

  componentDidMount() {
    const { r, g, b } = this.props.prevColorCode
    this.setState({
      r,
      g,
      b
    })
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
  
  onSetColorButtonPress = () => {
    const {r, g, b} = this.state;

    this.props.onColorChange({r, g, b});
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
          step={1}
        />
        <Slider
          onValueChange={(value) => this.onGChnage(value)}
          minimumValue={1}
          maximumValue={255}
          value={this.state.g}
          step={1}
        />
        <Slider
          onValueChange={(value) => this.onBChnage(value)}
          minimumValue={1}
          maximumValue={255}
          value={this.state.b}
          step={1}
        />
        <View style={layouts.centerWrapper}>
          <Button onPress={this.onSetColorButtonPress}>
            Set Color
          </Button>
        </View>
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
    paddingTop: 50,
    borderRadius: 20,
    height: '40%',
    flex: 0,
    justifyContent: 'space-between'
  })
}

export { ColorSlider };
