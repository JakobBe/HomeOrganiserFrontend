import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { CheckBox } from 'react-native-elements';
import  { CardSection }  from './CardSection';
import GestureRecognizer from 'react-native-swipe-gestures';
import { deleteToDo, deleteEvent, deleteShoppingItem, updateToDo } from '../Client';

class ListItem extends Component {
  state = { 
    checked: this.props.done,
    backgroundColor: '#fff',
    isSwipedLeft: false
  };

  onCheckBoxPress = () => {
    this.setState({ checked: !this.state.checked })

    updateToDo(this.props.id)
  }

  onSwipeLeft(gestureState) {
    this.setState({ isSwipedLeft: true });
  }

  onSwipeRight(gestureState) {
    this.setState({ isSwipedLeft: false });
  }

  onDeletePress = () => {
    if (this.props.isToDo) {
      deleteToDo(this.props.id);
    }

    if (!this.props.isToDo) {
      deleteEvent(this.props.id);
    }

    if(this.props.isShoppingItem) {
      deleteShoppingItem(this.props.id);
    }

    this.props.refreshList();
    this.setState({ isSwipedLeft: false });
  }

  getCheckbox = () => {
    if (this.props.isToDo) {
      return (
        <CheckBox
          onIconPress={this.onCheckBoxPress}
          checked={this.state.checked}
          center
          checkedColor={'#a9eec2'}
        />
      );
    };
  };

  getUserMark = () => {
    if (this.props.userName) {
      return (
        <View style={styles.userLetterStyleContainer(this.props.color || 'green')}>
          <Text style={styles.userLetterStyle}>
            {this.props.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      );
    };
  };

  getToDoListAddOn = () => {
    if (this.props.isToDo) {
      return (
        <View style={styles.toDoAddOnWrapper}>
          <Text style={styles.descriptionStyle}>
            {this.props.appointee}, {this.props.date}
          </Text>
          { this.getCheckbox() }
        </View>
      )   
    }
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    let deleteField = undefined;
    if (this.state.isSwipedLeft) {
      deleteField = (
        <TouchableOpacity onPress={this.onDeletePress} style={styles.deleteStyle}>
          <Text style={styles.deleteTextStyle}>
            Delete
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        <GestureRecognizer
          onSwipeLeft={(state) => this.onSwipeLeft(state)}
          onSwipeRight={(state) => this.onSwipeRight(state)}
          config={config}
          style={{
            flex: 1,
            backgroundColor: this.state.backgroundColor,
            justifyContent: 'space-between',
            position: 'relative',
            right: 2
          }}
        >
          <CardSection additionalCardSectionStyles={styles.listItemContainer}>
            {this.getUserMark()}
            <TouchableWithoutFeedback onPress={() => this.props.onItemPressed(this.props.text, this.props.id)}>
              <Text style={styles.titleStyle}>
                {this.props.text}
              </Text>
            </TouchableWithoutFeedback>
            {this.getToDoListAddOn()}
            {deleteField}
          </CardSection>
        </GestureRecognizer>
      </View>
    );
  }
}

const styles = {
  titleStyle: {
    fontSize: 18,
    paddingLeft: 15,
    width: 250,
    color: '#05004e'
  }, 

  descriptionStyle: {
    fontSize: 10,
    color: '#a9eec2'
  },

  checkBox: {
    height: 30,
    width: 30
  },

  deleteStyle: {
    position: 'absolute',
    right: 2,
    top: 2,
    bottom: 2,
    width: 120,
    backgroundColor: '#c40018',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },

  deleteTextStyle: {
    color: 'white',
    fontWeight: 'bold' 
  },

  listItemContainer: {
    height: 70,
    padding: 5,
  },

  userLetterStyleContainer: (color) => ({
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: color,
    justifyContent: 'center'
  }),

  userLetterStyle: {
    color: 'white',
    textAlign: 'center',
  },

  toDoAddOnWrapper: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center'
  }
};

export { ListItem };