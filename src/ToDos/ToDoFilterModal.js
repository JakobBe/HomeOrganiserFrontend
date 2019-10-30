import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import { colorPalette } from '../Style';

class ToDoFilterModal extends Component {
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
        visible={this.props.showFilterModal}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.modalContainer}>
            <TouchableHighlight
              onPress={() => this.props.onModalClose()}
              style={{ top: 3, left: '85%' }}
            >
              <Text style={{ color: colorPalette.primary, fontWeight: 'bold' }}>Close</Text>
            </TouchableHighlight>
            <View style={styles.filterWrapper}>
              {/* <Text style={styles.filterText}>
                Filter:
              </Text> */}
              <TouchableHighlight onPress={() => this.props.onFilterToDosPress('undone')}>
                <Text style={styles.filterText}>
                  Show only open ToDos
                </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.props.onFilterToDosPress('done')}>
                <Text style={styles.filterText}>
                  Show only done ToDos
                </Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.props.onFilterToDosPress('all')}>
                <Text style={styles.filterText}>
                  Show all
                </Text>
              </TouchableHighlight>
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
    marginBottom: 110,
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

  filterWrapper: {
    flex: 0,
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  filterText: {
    color: colorPalette.secondary,
    margin: 20,
    fontSize: 15,
    textDecorationLine: 'underline' 
  }
}

export default ToDoFilterModal;