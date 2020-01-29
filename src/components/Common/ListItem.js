import React, { Component } from 'react';
import { Text, Animated, Easing, View, TouchableOpacity, TouchableWithoutFeedback, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import  { CardSection }  from './CardSection';
import GestureRecognizer from 'react-native-swipe-gestures';
import { deleteToDo, deleteEvent, deleteShoppingItem, updateToDo, updateExpense } from '../../RailsClient';
import { colorPalette } from '../../Style/Colors';

class ListItem extends Component {
  animatedValue = new Animated.Value(0);

  state = { 
    checked: this.props.done,
    backgroundColor: '#fff',
    isSwipedLeft: false
  };

  componentDidMount() {
    
  }

  animate = () => {
    this.animatedValue.setValue(0)
    Animated.decay(
      this.animatedValue,
      {
        toValue: 1,
        velocity: 1
      }
    ).start(() => this.animate())
  }

  onCheckBoxPress = () => {
    this.setState({ checked: !this.state.checked })

    updateToDo(this.props.id)
  }

  onSwipeLeft(gestureState) {
    this.animate();
    this.setState({ isSwipedLeft: true });
  }

  onSwipeRight(gestureState) {
    if (this.state.isSwipedLeft) {
      this.setState({ isSwipedLeft: false });
    };

    if (!this.state.isSwipedLeft && this.props.isShoppingItem) {
      this.props.addToShoppingCart(this.props.id)
    };
  }

  onDeletePress = () => {
    if (this.props.isToDo) {
      deleteToDo(this.props.id);
    }

    if (this.props.isCalendarEntry && this.props.itemUserId === this.props.currentUserId) {
      deleteEvent(this.props.id);
    }

    if (this.props.isCalendarEntry && this.props.itemUserId !== this.props.currentUserId) {
      Alert.alert("You can not delete this entry");
    }

    if(this.props.isShoppingItem) {
      deleteShoppingItem(this.props.id);
    }

    this.props.refreshList();
    this.setState({ isSwipedLeft: false });
  }

  onResetPress = () => {
    updateExpense(this.props.id);
    this.setState({ isSwipedLeft: false });
  }

  getCheckbox = () => {
    if (this.props.isToDo && !this.state.isSwipedLeft) {
      return (
        <CheckBox
          style={styles.checkBox}
          onIconPress={this.onCheckBoxPress}
          checked={this.state.checked}
          center
          checkedColor={colorPalette.primary}
        />
      );
    };
  };

  getUserMark = () => {
    if (this.props.userName) {
      return (
        <View style={styles.userLetterStyleContainer(this.props.userColor || 'black')}>
          <Text style={styles.userLetterStyle}>
            {this.props.userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      );
    };

    return null;
  };

  getToDoListAddOn = () => {
    if (this.props.isToDo) {
      return (
        <View style={styles.toDoAddOnWrapper}>
          {/* <Text style={styles.descriptionStyle}>
            {this.props.appointee}, {this.props.date}
          </Text> */}
          { this.getCheckbox() }
        </View>
      )   
    }
  }

  getExtraInfo = () => {
    if (this.props.isToDo && this.props.description !== this.props.userName) {
      return (
        <Text style={styles.descriptionStyle(this.props.appointerColor)}>
          {"\n"} Appointed by {this.props.description} {this.props.date}
        </Text>
      );
    };
    if (this.props.isCalendarEntry) {
      return (
        <Text style={styles.descriptionStyle(this.props.appointerColor)}>
          {"\n"} At {this.props.description}
        </Text>
      );
    };
    if (this.props.isExpense) {
      return (
        <Text style={styles.descriptionStyle(this.props.appointerColor)}>
          {"\n"} {this.props.date}
        </Text>
      );
    }
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    const width = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 120]
    })

    let deleteField = undefined;
    if (this.state.isSwipedLeft) {
      deleteField = (
      <Animated.View style={styles.itemActions(width)}>
        <TouchableOpacity onPress={this.onDeletePress} style={styles.deleteStyle}>
          <Text style={styles.deleteTextStyle}>
            Delete
          </Text>
        </TouchableOpacity>
      </Animated.View>
      );
    }

    if (this.state.isSwipedLeft && this.props.isExpense) {
      deleteField = (
        <Animated.View style={styles.itemActions(width)}>
          <TouchableOpacity onPress={this.onResetPress} style={styles.resetStyle}>
            <Text style={styles.resetTextStyle}>
              Settle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onDeletePress} style={styles.deleteStyle}>
            <Text style={styles.deleteTextStyle}>
              Delete
            </Text>
          </TouchableOpacity>
        </Animated.View>
      );
    }

    return (
      <View>
        <GestureRecognizer
          onSwipeLeft={(state) => this.onSwipeLeft(state)}
          onSwipeRight={(state) => this.onSwipeRight(state)}
          config={config}
        >
          <CardSection additionalCardSectionStyles={styles.listItemContainer}>
            {this.getUserMark()}   
            <TouchableWithoutFeedback onPress={() => this.props.onItemPressed(this.props.item, this.props.id)}>
              <Text style={styles.titleStyle}>
                {this.props.text}
                {this.getExtraInfo()}
              </Text>
            </TouchableWithoutFeedback>
            {this.getCheckbox()}
            {deleteField}
          </CardSection>
        </GestureRecognizer>
      </View>
    );
  }
}

const styles = {
  titleStyle: {
    paddingLeft: 10,
    fontSize: 18,
    width: 250,
    color: colorPalette.secondary,
  }, 

  descriptionStyle: (color) => ({
    fontSize: 10,
    color
  }),

  checkBox: {
    height: 30,
    width: 30
  },

  itemActions: (width) => ({
    position: 'absolute',
    right: 2,
    top: 2,
    bottom: 2,
    width,
    flex: 0,
    flexDirection: 'row',
  }),

  deleteStyle: {
    flex: 1,
    backgroundColor: '#c40018',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },

  deleteTextStyle: {
    color: 'white',
    fontWeight: 'bold' 
  },

  resetStyle: {
    flex: 1,
    backgroundColor: 'darkgreen',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },

  resetTextStyle: {
    color: 'white',
    fontWeight: 'bold'
  },

  listItemContainer: {
    height: 100,
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