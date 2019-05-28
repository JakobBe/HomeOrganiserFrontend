import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[props.additionalButtonStyles, styles.buttonStyle]}>
      <Text style={styles.textStyle}>
        {props.children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    borderRadius: 13,
    borderWidth: 1.3,
    borderColor: '#a9eec2',
    marginLeft: 5,
    marginRight: 5,
  },

  textStyle: {
    color: '#a9eec2',
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

export { Button } ;
