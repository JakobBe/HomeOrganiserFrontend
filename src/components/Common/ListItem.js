import React, { Component } from 'react';
import { Text, Animated, Easing, View, TouchableOpacity, TouchableWithoutFeedback, Alert, Image, Vibration } from 'react-native';
import { CheckBox } from 'react-native-elements';
import  { CardSection }  from './CardSection';
import GestureRecognizer from 'react-native-swipe-gestures';
import { deleteToDo, deleteEvent, deleteShoppingItem, updateExpense } from '../../RailsClient';
import { colorPalette } from '../../Style/Colors';

class ListItem extends Component {
  state = {
    backgroundColor: '#fff',
    isSwipedLeft: false
  };

  constructor() {
    super();
    this.deleteWidth = new Animated.Value(0);
  }
  // animatedValue = new Animated.Value(0);

  animateDeleteButton = () => {
    if (this.state.isSwipedLeft) {
      Animated.timing(
        this.deleteWidth,
        {
          toValue: 0,
          duration: 180 
        }
      ).start();
      return;
    }

    Animated.timing(
      this.deleteWidth,
      {
        toValue: 200,
        duration: 180
      }
    ).start();
  }

  onCheckBoxPress = () => {
    if (this.props.isToDo) {
      this.props.updateToDo(this.props.id, !this.props.done, this.props.text, this.props.appointee);
      Vibration.vibrate();
    };

    if (this.props.isShoppingItem) {
      !this.props.bought ? this.props.addToShoppingCart(this.props.id) : this.props.removeFromShoppingCart(this.props.item);
      
      this.props.updateShoppingItem(this.props.id, !this.props.bought, this.props.text);
      Vibration.vibrate();
    }
  }

  onSwipeLeft(gestureState) {
    this.animateDeleteButton();
    this.setState({ isSwipedLeft: true });
  }

  onSwipeRight(gestureState) {
    if (this.state.isSwipedLeft) {
      this.animateDeleteButton();
      this.setState({ isSwipedLeft: false });
    };

    if (!this.state.isSwipedLeft && this.props.isShoppingItem) {
      this.props.addToShoppingCart(this.props.id)
    };
  }

  onDeletePress = () => {
    if (this.props.isCalendarEntry && this.props.itemUserId !== this.props.currentUserId) {
      Alert.alert("You can not delete this entry");
      this.onSwipeRight();
      return;
    }

    this.props.deleteItem(this.props.id);
  }

  onResetPress = () => {
    updateExpense(this.props.id);
    this.setState({ isSwipedLeft: false });
  }

  getCheckbox = () => {
    if (this.props.isToDo || this.props.isShoppingItem) {
      return (
        <CheckBox
          style={styles.checkBox}
          onIconPress={this.onCheckBoxPress}
          checked={this.props.done || this.props.bought}
          center
          checkedColor={colorPalette.primary}
        />
      );
    };
  };

  getUserMark = () => {
    if (this.props.forEveryone) {
      return (
        <Image source={require('../../../assets/images/rainbow.png')} style={styles.userLetterStyleContainer('black')}/>
      );
    };

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
    if (this.props.appointer) {
      return (
        <Text style={styles.descriptionStyle(this.props.appointer.color)}>
          {"\n"} Appointed by {this.props.appointer.name}
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
      // return (
      //   <Text style={styles.descriptionStyle(this.props.userColor)}>
      //     {"\n"} {moment.utc(this.props.date).format('DD-MM-YYYY')}
      //   </Text>
      // );
    }
  }

  render() {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    let deleteField = (
    <Animated.View style={styles.itemActions(this.deleteWidth)}>
      <TouchableOpacity onPress={this.onDeletePress} style={styles.deleteStyle}>
        <Text style={styles.deleteTextStyle}>
          Delete
        </Text>
      </TouchableOpacity>
    </Animated.View>
    );

    if (this.state.isSwipedLeft && this.props.isExpense) {
      deleteField = (
        <Animated.View style={styles.itemActions(this.deleteWidth)}>
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
          <CardSection additionalCardSectionStyles={styles.listItemContainer(this.props.backgroundColor)}>
            {this.getUserMark()}   
            <TouchableWithoutFeedback onPress={() => this.props.onItemPressed(this.props.id)}>
              <Text style={styles.titleStyle(this.props.bought, this.props.textColor)}>
                {this.props.text}
                {this.getExtraInfo()}
              </Text>
            </TouchableWithoutFeedback>
            {this.getCheckbox()}
          </CardSection>
          {deleteField}
        </GestureRecognizer>
      </View>
    );
  }
}

const styles = {
  titleStyle: (bought, textColor) => ({
    flex: 1,
    paddingLeft: 10,
    fontSize: 15,
    width: 250,
    color: textColor ? textColor : colorPalette.secondary,
    textDecorationLine: bought ? 'line-through' : 'none'
  }), 

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

  listItemContainer: (backgroundColor) => ({
    height: 70,
    backgroundColor: backgroundColor ? backgroundColor : 'white',
  }),

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