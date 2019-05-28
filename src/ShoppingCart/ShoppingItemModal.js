import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, numeric } from 'react-native';
import { Button, Input } from '../common';

class ShoppingItemModal extends Component {
  state = {
    item: undefined,
    price: undefined
  };

  onPriceInput = (price) => {
    this.setState({
      price
    });
  };

  onButtonPress = () => {
    this.props.saveInput((this.state.item || this.props.item), this.state.price, this.props.id);
    this.setState({
      price: ''
    });
  };
 
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.modalContainer}>
          <TouchableHighlight
            onPress={() => this.props.onModalClose()}
            style={{ top: 3, left: '85%' }}
          >
            <Text style={{ color: '#a9eec2', fontWeight: 'bold' }}>Close</Text>
          </TouchableHighlight>
          <Input
            value={this.state.item || this.props.item}
            onChangeText={value => this.setState({ item: value })}
          />
          <View style={styles.priceInputWrapper}>
            <Text style={styles.priceLable}>
              Price:
            </Text>
            <Input
              value={this.state.price}
              onChangeText={value => this.onPriceInput(value)}
              placeholder={'0.00$'}
              keyboardType={numeric}
              additionalInputStyles={styles.additionalPriceInputStyles}
              autoFocus={true}
            />
          </View>
          <Button
            onPress={() => this.onButtonPress()}
            additionalButtonStyles={styles.buttonStyle}
          >
            Mark as bought
          </Button>
        </View>
      </Modal>
    );
  }
}

const styles = {
  modalContainer: {
    margin: 30,
    marginTop: 80,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    borderColor: '#a9eec2',
    borderStyle: 'solid',
    borderWidth: 1.5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
    height: 400
  },

  buttonStyle: {
    backgroundColor: '#05004e',
    marginTop: 5
  },

  priceInputWrapper: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  additionalPriceInputStyles: {
    width: 100
  },

  priceLable: {
    color: '#05004e',
    paddingRight: 10,
    paddingLeft: 10,
    fontSize: 20,
  }
}

export default ShoppingItemModal;