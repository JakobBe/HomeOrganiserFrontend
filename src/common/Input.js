import React from 'react';
import { TextInput, Text, View } from 'react-native';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, additionalInputStyles, autoFocus }) => {
  return (
    <View style={[additionalInputStyles, styles.containerStyle]}>
      {/* <Text style={styles.labelStyle}>
        {label}
      </Text> */}
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={styles.inputStyle}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
      />
    </View>
  )
};

const styles = {
  inputStyle: {
    color: '#05004e',
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 20,
    backgroundColor: 'rgb(256,256,256)',
    // borderRadius: 13,
    borderBottomWidth: 2,
    borderColor: '#a9eec2',
    alignItems: 'center',
    height: 40,
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: -1
  },
  containerStyle: {
    margin: 5,
    marginTop: 20,
  }
};

export { Input };
