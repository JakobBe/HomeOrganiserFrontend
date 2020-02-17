import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { colorPalette } from '../../Style/Colors';

const CloseButton = (props) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
    >
      <Image source={require('../../../assets/images/close.png')} style={[styles.closeButtonStyle, props.additionalCloseButtonStyle]} />
    </TouchableOpacity>
  );
}

const styles = {
  closeButtonStyle: {
    height: 25,
    width: 25,
    top: 3,
    left: '90%'
  }
}

export { CloseButton };