import React from 'react';
import { TextInput, Text, View, TouchableOpacity } from 'react-native';
import { colorPalette } from '../../Style/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, additionalInputStyles, autoFocus, onBlur, additionalTextFieldStyle, onFocus, keyboardType, maxLength, focus, newRef, returnKeyType, onKeyPress, withEdit, editCallback, editable, color }) => {

  if (withEdit) {
    const colorBlock = color ? <View style={{height: 30, width: '90%', position: 'absolute', backgroundColor: color, top: 25, padding: 10}}></View> : undefined; 
    return (
      <View style={[styles.containerStyle, additionalInputStyles]}>
        <Text style={styles.labelStyle}>
          {label}
        </Text>
        <TouchableOpacity onPress={() => editCallback()}>
          <FontAwesomeIcon icon={faEdit} style={styles.editButton}/>
        </TouchableOpacity>
        <TextInput
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          autoCorrect={false}
          style={[styles.inputStyle(editable), additionalTextFieldStyle]}
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          onBlur={onBlur}
          onFocus={onFocus}
          keyboardType={keyboardType}
          maxLength={maxLength}
          ref={newRef}
          returnKeyType={returnKeyType}
          onKeyPress={onKeyPress}
          editable={editable}
        />
        {colorBlock}
      </View>
    );
  }

  return (
    <View style={[styles.containerStyle, additionalInputStyles]}>
      <Text style={styles.labelStyle}>
        {label}
      </Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        style={[styles.inputStyle(true), additionalTextFieldStyle]}
        value={value}
        onChangeText={onChangeText}
        autoFocus={autoFocus}
        onBlur={onBlur}
        onFocus={onFocus}
        keyboardType={keyboardType}
        maxLength={maxLength}
        ref={newRef}
        returnKeyType={returnKeyType}
        onKeyPress={onKeyPress}
      />
    </View>
  )
};

const styles = {
  inputStyle: (editable) => ({
    color: editable ? 'rgba(36,36,36,1)' : 'rgba(36,36,36,.5)',
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 20,
    backgroundColor: 'rgb(256,256,256)',
    borderBottomWidth: 2,
    borderColor: editable ? 'rgba(36,36,36,1)' : 'rgba(36,36,36,.5)',
    alignItems: 'center',
    height: 40,
  }),

  labelStyle: {
    fontSize: 12,
    flex: -1,
    color: 'rgba(100,100,100,.7)',
    paddingBottom: 5
  },

  containerStyle: {
    margin: 5,
    marginTop: 20,
    position: 'relative'
  },

  editButton: {
    position: 'absolute',
    top: -15,
    right: 5,
    zIndex: 4,
    fontSize: 0,
    color: colorPalette.primary
  }
};

export { Input };
