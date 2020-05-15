import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, numeric } from 'react-native';
import { Button, Input, CloseButton } from '../Common';
import { createExpense } from '../../RailsClient';
import { colorPalette, layouts } from '../../Style';

class ShoppingItemModal extends Component {
  state = {
    itemName: undefined
  };

  componentDidUpdate(prevProps) {
    const { name, id } = this.props.modalItem;

    if (id !== prevProps.modalItem.id) {
      this.setState({
        itemName: name
      })
    }
  }

  onTextChange = (itemName) => {
    this.setState({
      itemName
    });
  };

  onSaveButtonPress = () => {
    const itemName = this.state.itemName;
    const id = this.props.modalItem.id;
    this.props.updateShoppingItem({id, name: itemName});
  };


  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.modalContainer}>
            <CloseButton onPress={() => this.props.onModalClose()}/>
            <View style={styles.priceInputWrapper}>
              <Input
                value={this.state.itemName}
                onChangeText={value => this.onTextChange(value)}
                placeholder={'Item'}
                additionalInputStyles={styles.additionalInputStyles}
                autoFocus={true}
              />
            </View>
            <View style={layouts.centerWrapper}>
              <Button
                onPress={() => this.onSaveButtonPress()}
                additionalButtonStyles={styles.buttonStyle}
              >
                Save
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

  additionalInputStyles: {
    flexGrow: 1,
    marginBottom: 20
  },

  priceLable: {
    color: colorPalette.secondary,
    fontSize: 20,
  }
}

export default ShoppingItemModal;