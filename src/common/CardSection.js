import React from 'react';
import { View } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={[props.additionalCardSectionStyles, styles.containerStyle]}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    borderBottomWidth: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: '#ddd',
    position: 'relative',
    alignItems: 'center'
  }
};

export { CardSection };