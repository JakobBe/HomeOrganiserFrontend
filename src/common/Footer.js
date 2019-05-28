import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';

class Footer extends Component {
  onMoneyboxPress = () => {
    Actions.moneyBox({ type: ActionConst.REPLACE })
  }

  onCleaningPress = () => {
    Actions.toDoList({ type: ActionConst.REPLACE })
  }

  onShoppingcartPress = () => {
    Actions.shoppingList({ type: ActionConst.REPLACE })
  }

  onClanedarPress = () => {
    Actions.calendar({ type: ActionConst.REPLACE })
  }

  onHomePress = () => {
    Actions.entry({ type: ActionConst.REPLACE })
  }

  render() {
    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={this.onMoneyboxPress} >
          <View>
            <Image source={require('../../assets/images/piggy-bank.png')} style={styles.imageStyle} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onClanedarPress} >
          <View>
            <Image source={require('../../assets/images/smartphone.png')} style={styles.imageStyle} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onHomePress} >
          <View>
            <Image source={require('../../assets/images/home-color.png')} style={styles.homeImageStyle} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onCleaningPress} >
          <View>
            <Image source={require('../../assets/images/laundry.png')} style={styles.imageStyle} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onShoppingcartPress} >
          <View>
            <Image source={require('../../assets/images/pear.png')} style={styles.imageStyle} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
};

const styles = {
  footerContainer: {
    display: 'flex',
    felx: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgb(255,255,255)',
    padding: 10,
    paddingBottom: 20,
    borderRadius: 5,
    borderTopColor: '#05004e',
    borderTopWidth: 1
  },

  iconWrapperStyle: {
    marginTop: 10 
  },

  imageStyle: {
    height: 50,
    width: 50,
    // backgroundColor: '#f38181',
    // borderRadius: 25,
    padding: 10
  },

  homeImageStyle: {
    height: 30,
    width: 30,
    // backgroundColor: '#f38181',
    // borderRadius: 25,
    padding: 10
  },

  titleStyle: {
    fontSize: 18,
    paddingLeft: 15
  }
};

export { Footer };