import React from 'react';
import { View } from 'react-native';
import { colorPalette } from '../../Style/Colors';

const Card = (props) => {
  console.log(props);
  return (
    <View style={[props.additionalCardStyle, styles.containerStyle]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    marginTop: 15,
    height: 250,
    color: colorPalette.secondary
  }
};

export { Card };
