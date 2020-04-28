import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const Spinner = (props) => {
  console.log('props', props);
  return (
    <View style={[styles.spinnerStyle, props.additionalSpinnerStyle]}>
      <ActivityIndicator size={props.size || 'large'} color={props.color || 'grey'}/>
    </View>
  );
};

const styles = {
  spinnerStyle: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 38
  }
};

export { Spinner };
