import React from 'react';
import { View, Text } from 'react-native';

const NotificationNumber = (props) => {
  return (
    <View style={styles.notificationWrapper}>
      <Text style={styles.notificationNumberStyle}>
        {props.invitations.length}
      </Text>
    </View>
  );
}

const styles = {
  notificationWrapper: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: 'orangered',
    justifyContent: 'center',
    zIndex: 0
  },

  notificationNumberStyle: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  }
};

export { NotificationNumber } ;