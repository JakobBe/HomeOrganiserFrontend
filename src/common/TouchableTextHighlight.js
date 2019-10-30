import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

class TouchableTextHighlight extends React.Component  {
  state = {
    color: 'black'
  }

  onPressIn = () => {
    console.log('onPressIn', this.state.color)
    this.setState({
      color: this.props.feedbackColor
    })
  }

  onPressOut = () => {
    console.log('onPressOut', this.state.color)
    this.setState({
      color: 'black'
    })  
  }

  render() {
    const textColor = this.state.color;

    return (
      <TouchableWithoutFeedback 
        style={this.props.touchableWithoutFeedbackStyles} 
        onPressIn={this.onPressIn} 
        onPressOut={this.onPressOut}
        onPress={this.props.onPress}
      >
        <View style={[styles.textStyle(textColor), this.props.additionalTextStyles]}>
          {this.props.children}
        </View>
      </TouchableWithoutFeedback>
    )
  }
};

const styles = {
  textStyle: (color) => ({
    color
  })
};

export { TouchableTextHighlight };
