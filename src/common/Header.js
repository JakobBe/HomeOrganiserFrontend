import React from 'react';
import { Text, View } from 'react-native';

const Header = (props) => {
  const { textStyle, viewStyle } = styles;

  return (
    <View style={viewStyle}>
      <Text style={textStyle}>{props.titel}</Text>
    </View>
  );
};

const styles = {
  textStyle: {
    fontSize: 30,
    color: '#009F9D'
  },
  viewStyle: {
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#0A1128',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    shadowColor: 'rgb(100,100,100)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    elevation: 2,
    position: 'relative',
  }
};

export { Header };
