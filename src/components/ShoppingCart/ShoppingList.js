import React, { Component } from 'react';
import { View, RefreshControl, FlatList, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { Input, AddButton, Button, Footer, ListItem } from '../Common';
import { fetchShoppingItems, createShoppingItem, updateShoppingItem } from '../../RailsClient';
import { HomeContext } from '../../contexts/HomeContextHolder';
import ShoppingItemModal from './ShoppingItemModal';
import GestureRecognizer from 'react-native-swipe-gestures';
import { colorPalette } from '../../Style/Colors';

class ShoppingList extends Component {
  state = { 
    shoppingItems: [], 
    refreshing: false, 
    newShoppingItem: '', 
    modalPresented: false, 
    pressedItem: undefined, 
    pressedItemId: undefined,
    shoppingCart: [],
    isShoppingCartActive: false
  };

  componentWillMount() {
    this.fetchShoppingItems();
  }

  fetchShoppingItems = async () => {
    await fetchShoppingItems(this.props.homeContext.currentUser.id).then((response) => response.json())
      .then((res) => {
        if (res.length !== this.state.shoppingItems.length) {
          this.setState({
            shoppingItems: res
          });
        }
      })
  }

  onButtonPress = () => {
    if (this.state.newShoppingItem.length > 0) {
      this.setState(({
        newShoppingItem: ''
      }));

      createShoppingItem(this.state.newShoppingItem, this.props.homeContext.currentUser.id);
      this._onRefresh()
    };
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchShoppingItems().then(() => {
      this.setState({ refreshing: false });
    });
  }

  renderItem = ({ item }) => {
    if (this.state.shoppingCart.filter(cartItem => { return cartItem.id === item.id }).length > 0) {
      return
    }

    return (
      <ListItem
        id={item.id}
        text={item.name}
        item={item}
        refreshList={this._onRefresh}
        isShoppingItem={true}
        onItemPressed={this.onItemPressed}
        addToShoppingCart={this.addToShoppingCart}
      />
    );
  };

  renderShoppingCartItem = ({ item }) => {
    return(
      <View>
        <GestureRecognizer onSwipeLeft={(state) => this.onCartItemSwipeLeft(state, item)}>
          <View style={styles.shoppingCartItem}>
            <Text style={styles.cartItemTextStyle}>
              {item.name}
            </Text>
          </View>
        </GestureRecognizer>
      </View>
    );
  }

  onCartItemSwipeLeft = (state, item) => {
    this.removeFromShoppingCart(item)
  }

  saveModalInput = (text, price, id) => {
    updateShoppingItem(id, text, price, this.props.homeContext.currentUser.id);
    this.setState({
      modalPresented: false
    });
  };

  onItemPressed = (item, id) => {
    this.setState({
      modalPresented: true,
      pressedItem: item,
      pressedItemId: id
    });
  };

  onCartButtonPress = () => {
    this.setState({
      modalPresented: true
    });
  }

  onShoppingBagPress = () => {
    this.setState({
      isShoppingCartActive: !this.state.isShoppingCartActive
    });
  };

  onModalCose = () => {
    if (this.state.modalPresented) {
      this.setState({
        modalPresented: false,
        pressedItem: undefined,
        pressedItemId: undefined,
        isShoppingCartActive: false
      });
    };
  };

  getShoppingCart = () => {
    const extractKey = ({ id }) => id
    if (this.state.isShoppingCartActive) {
      return (
        <View style={styles.shoppingCartWrapper}>
          <FlatList
            style={styles.listWrapper}
            data={this.state.shoppingCart}
            renderItem={this.renderShoppingCartItem}
            keyExtractor={extractKey}
          />
          <Button onPress={this.onCartButtonPress} additionalButtonStyles={styles.additionalCartButtonStyle}>
            Complete Shopping
          </Button>
        </View>
      )
    };
    return undefined;
  }

  getNotificationNumber = () => {
    if (this.state.shoppingCart.length > 0) {
      return (
        <View style={styles.notificationWrapper}>
          <Text style={styles.notificationNumberStyle}>
            {this.state.shoppingCart.length}
          </Text>
        </View>
      );
    };
  }

  addToShoppingCart = (id) => {
    if (this.state.shoppingCart.filter(item => {return item.id === id}).length > 0) {
      Alert.alert("This item is already in your Shopping Cart");
      return 
    }
    let shoppingItem = this.state.shoppingItems.filter(item => {
      return item.id === id;
    });

    const newShoppingCart = this.state.shoppingCart.concat(shoppingItem[0])
    this.setState({
      shoppingCart: newShoppingCart
    });
  }

  removeFromShoppingCart = (item) => {
    const newShoppingCart = [...this.state.shoppingCart]
    let index = newShoppingCart.indexOf(item)
    newShoppingCart.splice(index, 1);
    this.setState({
      shoppingCart: newShoppingCart
    });
  }

  render() {
    const extractKey = ({ id }) => id
    const shoppingCart = this.getShoppingCart()
    return (
      <View style={styles.shoppingListContainer}>
        <View style={styles.inputWrapper}>
          <Input
            value={this.state.newShoppingItem}
            onChangeText={value => this.setState({ newShoppingItem: value })}
            placeholder={'Shopping Item'}
            additionalInputStyles={styles.additionalInputStyles}
            additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
            autoFocus={false}
          />
          <AddButton onPress={this.onButtonPress}/>
        </View>
        <View style={styles.shoppingContentWrapper}>
          <View style={styles.shoppingItemListWrapper}>
            <FlatList
              style={styles.listWrapper}
              data={this.state.shoppingItems}
              renderItem={this.renderItem}
              keyExtractor={extractKey}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            />
          </View>
          <View style={styles.shoppingBasketWrapper}>
            {this.getNotificationNumber()}
            <TouchableOpacity onPress={this.onShoppingBagPress}>
              <Image source={require('../../../assets/images/shopping-basket.png')} style={styles.shoppingCartImageStyle} />
            </TouchableOpacity>
          </View>
          {shoppingCart}
        </View>
        <ShoppingItemModal
          showModal={this.state.modalPresented}
          saveInput={this.saveModalInput}
          onModalClose={this.onModalCose}
          item={this.state.pressedItem}
          id={this.state.pressedItemId}
          cartItems={this.state.shoppingCart}
          currentUser={this.props.homeContext.currentUser}
        />
        <Footer isShoppingCartActive={true}/>
      </View>
    );
  }
};

const styles = {
  shoppingListContainer: {
    backgroundColor: 'rgb(255,255,255)',
    height: '100%'
  },

  listWrapper: {
    marginTop: 5,
    height: 300
  },

  additionalCartButtonStyle: {
    backgroundColor: 'black',
    marginBottom: 5,
  },

  inputWrapper: {
    backgroundColor: 'rgba(240,240,240,.9)',
    borderRadius: 20,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 2,
    margin: 10,
    marginTop: 5,
  },

  additionalInputStyles: {
    flexGrow: 1,
    marginTop: 0,
    maxWidth: '85%'
  },

  shoppingContentWrapper: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'relative'
  },

  shoppingCartWrapper: {
    borderLeftWidth: 0.5,
    borderLeftColor: colorPalette.secondary,
    flex: 1,
    padding: 5,
  },

  shoppingBasketWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10
  },

  shoppingItemListWrapper: {
    flex: 1
  },

  shoppingCartImageStyle: {
    height: 35,
    width: 35,
    padding: 2,
    marginLeft: 2
  },

  shoppingCartItem: {
    borderBottomWidth: 0.5,
    padding: 5,
    height: 60
  },

  cartItemDeleteButton: {

  },

  cartItemTextStyle: {
    textDecorationLine: 'line-through',
    paddingLeft: 10,
    fontSize: 18,
    width: 250,
    color: colorPalette.secondary,
  },

  notificationWrapper: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    backgroundColor: 'orangered',
    justifyContent: 'center',
    zIndex: -1
  },

  notificationNumberStyle: {
    color: 'white',
    textAlign: 'center'
  }
}

export default (props) => (
  <HomeContext.Consumer>
    {homeContext => <ShoppingList {...props} homeContext={homeContext} />}
  </HomeContext.Consumer>
);