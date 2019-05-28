import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, numeric } from 'react-native';
import { Button, Input } from '../common';

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
        transparent={false}
        visible={this.props.showModal}
      >
        <View style={styles.modalContainer}>
          <TouchableHighlight
            onPress={() => this.props.onModalClose()}
            style={{ top: 3, left: '85%' }}
          >
            <Text style={{ color: '#a9eec2', fontWeight: 'bold' }}>Close</Text>
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
      </Modal>
    );
  }
}

const styles = {
  modalContainer: {
    margin: 30,
    marginTop: 80,
    backgroundColor: 'rgb(1,1,1)',
    widht: '100%',
    borderRadius: 10,
    borderColor: '#a9eec2',
    borderStyle: 'solid',
    borderWidth: 1.5,
    padding: 20,
    position: 'relative',
    height: 400,
    color: '#a9eec2'
  },

  filterWrapper: {
    flex: 0,
    justifyContent: 'space-between',
    color: '#a9eec2',
    height: 300
  },

  buttonStyle: {
    backgroundColor: '#05004e',
    marginTop: 5
  },

  filterText: {
    color: '#a9eec2',
    // backgroundColor: 'red',
    // heigh: 30,
    // width: 100,
    // borderRadius: 100
  }
}

export default ToDoFilterModal;