import React from 'react';
import { View } from 'react-native';
import { colorPalette } from '../Style/Colors';

const HorizontalSeperater = () => {
  return (
    <View style={styles.seperater}/>
  );
}

const styles = {
  seperater: {
    height: 2,
    alignSelf: "stretch",
    backgroundColor: colorPalette.secondary,
    margin: 5,
    marginTop: 20,
  }
}

export { HorizontalSeperater };