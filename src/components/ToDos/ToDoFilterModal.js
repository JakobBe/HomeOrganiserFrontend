import React, { Component } from 'react';
import { Modal, View, Picker } from 'react-native';
import { colorPalette, layouts } from '../../Style';
import { CloseButton, Button } from '../Common';

class ToDoFilterModal extends Component {
  getFilterOneValues = () => {
    const filterOneValues = ['All ToDos', 'Open ToDos', 'Done ToDos'];

    return filterOneValues.map(value => {
      return (
        <Picker.Item label={value} value={value} style={{ color: colorPalette.secondary }} />
      );
    });
  }

  getFilterTwoValues = () => {
    const filterTwoValues = ['I can see', 'for me', 'for me & everyone', 'appointed by me'];

    return filterTwoValues.map(value => {
      return (
        <Picker.Item label={value} value={value} style={{ color: colorPalette.secondary }} />
      );
    });
  }

  onPriceInput = (price) => {
    this.setState({
      price
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
              <View style={styles.filterPickerWrapper}>
                <Picker
                  selectedValue={this.props.filterOneValue}
                  onValueChange={value => this.props.onFilterValueOneChange(value)}
                  style={{ height: 200, backgroundColor: 'white', width: 150, color: colorPalette.secondary }}
                  itemStyle={{ height: 200 }}
                >
                  {this.getFilterOneValues()}
                </Picker>
                <Picker
                  selectedValue={this.props.filterTwoValue}
                  onValueChange={value => this.props.onFilterValueTwoChange(value)}
                  style={{ height: 200, backgroundColor: 'white', width: 150, color: colorPalette.secondary }}
                  itemStyle={{ height: 200 }}
                >
                  {this.getFilterTwoValues()}
                </Picker>
              </View>
              <View style={layouts.centerWrapper}>
                <Button onPress={() => this.props.onFilterToDosPress(this.props.filterOneValue, this.props.filterTwoValue)}>
                  Apply filter
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
    marginTop: 110,
    marginBottom: 110,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    // borderColor: colorPalette.primary,
    // borderStyle: 'solid',
    // borderWidth: .5,
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

  filterPickerWrapper: {
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: 5,
    borderRadius: 10,
  }
}

export default ToDoFilterModal;