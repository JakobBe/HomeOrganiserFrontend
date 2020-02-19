import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, numeric, FlatList, Alert, Animated } from 'react-native';
import { Button, Input, CloseButton, ListItem } from '../Common';
import { colorPalette, layouts, deviceHeight} from '../../Style';

class ShoppingCartModal extends Component {
  state = {
    price: undefined
  }

  constructor() {
    super();

    const listHeight = deviceHeight / 2.2
    this.listHeight = new Animated.Value(listHeight);
    // this.listHeight = this.listHeight.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [100, 400]
    // });
  }

  _keyboardShown = () => {
    const listHeight = deviceHeight / 3.5;
    Animated.timing(
      this.listHeight,
      {
        toValue: listHeight,
        duration: 250
      }
    ).start();
  }

  _keyboardHidden = () => {
    const listHeight = deviceHeight / 2.2;
    Animated.timing(
      this.listHeight,
      {
        toValue: listHeight,
        duration: 250
      }
    ).start();
  }
 
  onClearAsExpensePress = () => {
    if (this.state.price === undefined) {
      Alert.alert("Please provide a price in order to save as expense.");
      return;
    }

    this.props.onClearAsExpense();
  }

  onClearWithoutExpensePress = () => {
    Alert.alert("Are you sure you want to clear without adding an expense?", '', [
      { text: 'Cancle', onPress: () => console.log('cancle'), style: 'cancel'},
      { text: 'Yes', onPress: () => { this.props.onModalClose(), this.props.onClearWithoutExpense() }}
    ]);
  }

  renderItem = ({ item }) => {
    return (
      <View style={[styles.shoppingCartItem, layouts.centerWrapper]}>
        <Text style={styles.cartItemTextStyle}>
          {item.name}
        </Text>
      </View>
    );
  }

  render() {
    const extractKey = ({ id }) => id

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.modalContainer}>
            <CloseButton onPress={this.props.onModalClose} />
            <Animated.FlatList
              style={styles.list(this.listHeight)}
              data={this.props.shoppingItems}
              renderItem={this.renderItem}
              keyExtractor={extractKey}
            />
            <View style={styles.buttonsWrapper}>
              <View style={styles.inputWrapper}>
                <Input
                  value={this.state.price}
                  onChangeText={value => this.setState({ price: value })}
                  placeholder={'04.20$'}
                  additionalInputStyles={styles.additionalInputStyles}
                  additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
                  autoFocus={false}
                  onFocus={() => this._keyboardShown()}
                  onBlur={() => this._keyboardHidden()} 
                />
                <Button
                  onPress={() => this.onClearAsExpensePress()}
                  additionalButtonStyles={styles.additionalExpenseButtonStyle}
                >
                  Clear as expense
                </Button>
              </View>
              <View style={[styles.clearWithoutWrapper, layouts.centerWrapper]}>
                <Button
                  onPress={() => this.onClearWithoutExpensePress()}
                  additionalButtonStyles={styles.buttonStyle}
                >
                  Clear without expense
                </Button>
              </View>
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
    marginTop: 50,
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

  list: (height) => ({
    margin: 10,
    height,
    backgroundColor: 'rgba(240,240,240,.9)',
    borderRadius: 20,
    padding: 15,
  }),

  shoppingCartItem: {
    // borderBottomWidth: 0.5,
    padding: 5,
  },

  cartItemTextStyle: {
    textDecorationLine: 'line-through',
    paddingLeft: 10,
    fontSize: 20,
    width: 250,
    color: colorPalette.secondary,
  },

  buttonsWrapper: {
    flex: 0,
    justifyContent: 'space-between',
  },

  additionalExpenseButtonStyle: {
    backgroundColor: colorPalette.secondary,
    marginTop: 5,
    width: '60%'
  },

  buttonStyle: {
    backgroundColor: colorPalette.secondary,
    marginTop: 5
  },

  additionalInputStyles: {
    flexGrow: 1,
    marginTop: 0,
    maxWidth: '85%'
  },

  inputWrapper: {
    backgroundColor: 'rgba(240,240,240,.9)',
    borderRadius: 20,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 2,
    margin: 10
  },

  clearWithoutWrapper: {
    backgroundColor: 'rgba(240,240,240,.9)',
    borderRadius: 20,
    padding: 15,
    margin: 10
  }
}

export default ShoppingCartModal;