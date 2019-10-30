import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, numeric } from 'react-native';
import { Button, Input } from '../Common';
import { createExpense } from '../RailsClient';
import { colorPalette, layouts } from '../Style';

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
    if (!this.state.item && !this.props.item) {
      createExpense(this.props.currentUser.id, this.state.price, this.props.cartItems);
      this.props.onModalClose();
      return
    };

    const item = this.state.item || this.props.item
    createExpense(this.props.currentUser.id, this.state.price, [item]);
    this.setState({
      price: ''
    });
  };

  getLabelOrInput = () => {
    if (this.state.item || this.props.item) {
      return (
        <Input
          value={this.state.item || this.props.item || 'How much did you spend for the flat?'}
          onChangeText={value => this.setState({ item: value })}
        />
      );
    };

    if (!this.state.item && !this.props.item) 
      return (
        <Text>
          How much did you spend for the flat?
        </Text>
      );
    };

  render() {
    // const labelOrInput = this.getLabelOrInput();
    const buttonLabel = !this.state.item && !this.props.item ? 'Save expenses' : 'Mark as bought';
    const isCart = this.state.item && this.props.item
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.modalContainer}>
            <TouchableHighlight
              onPress={() => this.props.onModalClose()}
              style={{ top: 3, left: '85%' }}
            >
              <Text style={{ color: colorPalette.primary, fontWeight: 'bold' }}>Close</Text>
            </TouchableHighlight>
            {/* {labelOrInput} */}
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
            <View style={layouts.centerWrapper}>
              <Button
                onPress={() => this.onButtonPress()}
                additionalButtonStyles={styles.buttonStyle}
              >
                {buttonLabel}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  modalContainer: {
    margin: 30,
    marginTop: 110,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
  },

  buttonStyle: {
    backgroundColor: colorPalette.secondary,
    marginTop: 5
  },

  priceInputWrapper: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  additionalPriceInputStyles: {
    width: 100,
    margin: 0,
    marginBottom: 35
  },

  priceLable: {
    color: colorPalette.secondary,
    fontSize: 20,
  }
}

export default ShoppingItemModal;