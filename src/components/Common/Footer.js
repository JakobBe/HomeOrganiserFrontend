import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette } from '../../Style/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faEuroSign, faHome, faListAlt, faShoppingBag } from '@fortawesome/free-solid-svg-icons';

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
    const baseImagePath = '../../../assets/images/';
    const moneyBoxImage = this.props.isMoneyboxActive ? require(`${baseImagePath}/euro-c.png`) : require(`${baseImagePath}/euro.png`);
    const calendarImage = this.props.isCalendarActive ? require(`${baseImagePath}/calendar-c.png`) : require(`${baseImagePath}/calendar.png`);
    const homeImage = this.props.isHomeActive ? require(`${baseImagePath}/home-black-c.png`) : require(`${baseImagePath}/home-black.png`);
    const cleaningImage = this.props.isCleaningActive ? require(`${baseImagePath}/list-c.png`) : require(`${baseImagePath}/list.png`);
    const shoppingCartImage = this.props.isShoppingCartActive ? require(`${baseImagePath}/shopping-cart-c.png`) : require(`${baseImagePath}/shopping-cart.png`);

    return (
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={this.onMoneyboxPress} >
          <View style={styles.navigationWrapper}>
            <FontAwesomeIcon icon={faEuroSign} style={{ color: this.props.isMoneyboxActive ? colorPalette.primary : 'black', marginBottom: 8 }} size={25} />
            <Text style={styles.navigationText}>
              Money
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onClanedarPress} >
          <View style={styles.navigationWrapper}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ color: this.props.isCalendarActive ? colorPalette.primary : 'black', marginBottom: 8 }} size={25}/>
            <Text style={styles.navigationText}>
              Calendar
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onHomePress} >
          <View style={styles.navigationWrapper}>
            <FontAwesomeIcon icon={faHome} style={{ color: this.props.isHomeActive ? colorPalette.primary : 'black', marginBottom: 8 }} size={25} />
            <Text style={styles.navigationText}>
              Home
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onCleaningPress} >
          <View style={styles.navigationWrapper}>
            <FontAwesomeIcon icon={faListAlt} style={{ color: this.props.isCleaningActive ? colorPalette.primary : 'black', marginBottom: 8 }} size={25} />
            <Text style={styles.navigationText}>
              ToDo's
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.onShoppingcartPress} >
          <View style={styles.navigationWrapper}>
            <FontAwesomeIcon icon={faShoppingBag} style={{ color: this.props.isShoppingCartActive ? colorPalette.primary : 'black', marginBottom: 8 }} size={25} />
            <Text style={styles.navigationText}>
              Shopping
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
};

const styles = {
  footerContainer: {
    display: 'flex',
    felx: 2,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgb(255,255,255)',
    borderRadius: 5,
    borderTopColor: colorPalette.secondary,
    borderTopWidth: 1,
    minHeight: 80
  },


  imageStyle: {
    height: 25,
    width: 25,
    padding: 10,
    marginBottom: 8
  },

  homeImageStyle: {
    height: 20,
    width: 20,
    padding: 10,
    marginBottom: 13
  },

  titleStyle: {
    fontSize: 18,
    paddingLeft: 15
  },

  navigationWrapper: {
    flex: 0,
    alignItems: 'center'
  },

  navigationText: {
    fontSize: 8,
  }
};

export { Footer };