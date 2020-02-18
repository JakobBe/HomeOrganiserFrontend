import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import { colorPalette } from '../../Style';
import { CloseButton } from '../Common';
import { CheckBox } from 'react-native-elements';

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
            <CloseButton onPress={() => this.props.onModalClose()}/>
            <View style={styles.filterWrapper}>
              {/* <Text style={styles.filterText}>
                Filter:
              </Text> */}
              <TouchableHighlight onPress={() => this.props.onFilterToDosPress(false)}>
                <View style={styles.filterTextWrapper}>
                  <Text style={styles.filterText}>
                    Show only open ToDos
                  </Text>
                  <CheckBox
                    style={styles.checkBox}
                    checked={false}
                    center
                    checkedColor={colorPalette.primary}
                  />
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.props.onFilterToDosPress(true)}>
                <View style={styles.filterTextWrapper}>
                  <Text style={styles.filterText}>
                    Show only done ToDos
                  </Text>
                  <CheckBox
                    style={styles.checkBox}
                    checked={true}
                    center
                    checkedColor={colorPalette.primary}
                  />
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => this.props.onFilterToDosPress('all')}>
                <View style={styles.filterTextWrapper}>
                  <Text style={styles.filterText}>
                    Show all
                  </Text>
                  <View style={{ felx: 2, flexDirection: 'row' }}>
                    <CheckBox
                      style={styles.checkBox}
                      checked={false}
                      center
                      checkedColor={colorPalette.primary}
                    />
                    <CheckBox
                      style={styles.checkBox}
                      checked={true}
                      center
                      checkedColor={colorPalette.primary}
                    />
                  </View>
                </View>
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
    alignItems: 'flex-start',
  },

  filterTextWrapper: {
    marginTop: 20,
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  filterText: {
    color: colorPalette.secondary,
    margin: 20,
    fontSize: 20,
    textDecorationLine: 'underline' 
  },

  checkBox: {
    height: 30,
    width: 30
  }
}

export default ToDoFilterModal;