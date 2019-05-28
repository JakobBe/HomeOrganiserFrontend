import React, { Component } from 'react';
import { TextInput, Text, View } from 'react-native';
import { Card, Button, HorizontalSeperater, Input, CardSection, Footer } from '../common';

class MoneyEntry extends Component {
  state = {
    newSaving: '',
  }

  render() {
    return (
      <View style={styles.moneyBoxContainer}>
        <View style={styles.moneyBoxBox}>
          <Text style={styles.moneyBoxAmount}>
            100,00$
          </Text>
        </View>
        <CardSection additionalCardSectionStyles={styles.inputWrapper}>
          <Input
            value={this.state.newSaving}
            onChangeText={value => this.setState({ newSaving: value })}
            placeholder={'xxx,xx$'}
          />
          <Button additionalButtonStyles={styles.button}>
            Fill the Money Box
          </Button>
        </CardSection>
        <HorizontalSeperater />
        <Footer />
      </View>
    );
  }
}

const styles = {
  button: {
    height: 40,
    backgroundColor: '#05004e',
    marginTop: 10,
    alignItems: 'center'
  },

  moneyBoxAmount: {
    fontSize: 50,
    color: '#fd5f00'
  },

  moneyBoxBox: {
    borderWidth: 2,
    borderRadius: 1000,
    borderColor: '#05004e',
    shadowColor: '#05004e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },

  moneyBoxInput: {
    height: 35,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },

  inputWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },

  moneyBoxContainer: {
    backgroundColor: '#a9eec2',
    flex: 1,
    justifyContent: 'space-between'
  }
};

export default MoneyEntry;