import React from 'react';
import { View } from 'react-native';

const HorizontalSeperater = () => {
  return (
    <View style={styles.seperater}/>
  );
}

const styles = {
  seperater: {
    height: 2,
    alignSelf: "stretch",
    backgroundColor: '#05004e',
    margin: 5,
    marginTop: 20,
  }
}

export { HorizontalSeperater };