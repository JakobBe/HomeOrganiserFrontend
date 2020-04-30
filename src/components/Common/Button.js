import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { colorPalette } from '../../Style/Colors';

const Button = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.buttonStyle, props.additionalButtonStyles]} enabled={props.enabled}>
      <Text style={[styles.textStyle, props.additionalButtonTextStyles]}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    borderRadius: 13,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: colorPalette.secondary,
    width: 200,
  },

  textStyle: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

export { Button } ;
