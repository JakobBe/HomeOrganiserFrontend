import React from 'react';
import { TextInput, Text, View } from 'react-native';
import { colorPalette } from '../../Style/Colors';

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, additionalInputStyles, autoFocus, onBlur, additionalTextFieldStyle, onFocus, keyboardType }) => {
  return (
    <View style={[styles.containerStyle, additionalInputStyles]}>
      <Text style={styles.labelStyle}>
        {label}
      </Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={[styles.inputStyle, additionalTextFieldStyle]}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        onBlur={onBlur}
        onFocus={onFocus}
        keyboardType={keyboardType}
      />
    </View>
  )
};

const styles = {
  inputStyle: {
    color: colorPalette.secondary,
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 20,
    backgroundColor: 'rgb(256,256,256)',
    borderBottomWidth: 2,
    borderColor: colorPalette.primary,
    alignItems: 'center',
    height: 40,
  },
  labelStyle: {
    fontSize: 12,
    flex: -1,
    color: 'rgba(100,100,100,.7)',
    paddingBottom: 5
  },
  containerStyle: {
    margin: 5,
    marginTop: 20,
  }
};

export { Input };
