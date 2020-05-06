import React, { Component } from 'react';
import { View, RefreshControl, FlatList, Text, Alert, Image, TouchableOpacity, Keyboard } from 'react-native';
import { Input, AddButton, Button, Footer, ListItem } from '../Common';
// import { fetchShoppingItems, createShoppingItem, updateShoppingItem } from '../../RailsClient';
import { HomeContext } from '../../contexts/HomeContextHolder';
import ShoppingItemModal from './ShoppingItemModal';
import ShoppingCartModal from './ShoppingCartModal';
import GestureRecognizer from 'react-native-swipe-gestures';
import { colorPalette } from '../../Style/Colors';
import { createShoppingItem, deleteShoppingItem, updateShoppingItem } from '../../graphql/ShoppingItems/mutations';
import { createExpense } from '../../graphql/Expenses/mutations';
import { appSyncGraphQl } from '../../AWSClient';
import { defaultId, dateTimeFormat } from '../../Helpers/magicNumbers';
import { sortByCreatedAt } from '../../Helpers/sortByDate';
import moment from 'moment';

class ShoppingList extends Component {
  state = { 
    shoppingItems: [], 
    refreshing: false, 
    newShoppingItem: '', 
    itemModalPresented: false, 
    pressedItem: undefined, 
    pressedItemId: undefined,
    shoppingCart: [],
    isShoppingCartActive: false,
    cartModalPresented: false
  };

  componentDidMount() {
    const shoppingItemsForFilter = this.props.homeContext.shoppingItems;
    let shoppingItems = shoppingItemsForFilter.filter(shoppingItem => shoppingItem.boughtBy === defaultId);
    const sortedShoppingItems = sortByCreatedAt(shoppingItems);
    let shoppingCart = sortedShoppingItems.filter(shoppingItem => shoppingItem.bought);
    console.log('shoppingItems', shoppingItems);
    this.setState({
      shoppingItems: sortedShoppingItems,
      shoppingCart
    });
  }

  fetchShoppingItems = async () => {
    const shoppingItemsForFilter = await this.props.homeContext.updateShoppingItems();
    let shoppingItems = shoppingItemsForFilter.filter(shoppingItem => shoppingItem.boughtBy === defaultId);
    const sortedShoppingItems = sortByCreatedAt(shoppingItems);

    this.setState({
      shoppingItems: sortedShoppingItems
    });
  }

  onAddShoppingItemPress = () => {
    Keyboard.dismiss();
    if (this.state.newShoppingItem.length > 0) {
      this.setState(({
        newShoppingItem: ''
      }));

      const variables = {
        input: {
          name: this.state.newShoppingItem,
          userId: this.props.homeContext.currentUser.id,
          homeId: this.props.homeContext.id,
          bought: false,
          inShoppingCart: false,
          boughtBy: defaultId,
          createdAt: moment.utc().format(dateTimeFormat),
          updatedAt: moment.utc().format(dateTimeFormat)
        }
      };
      appSyncGraphQl(createShoppingItem, variables)
        .then((res) => {
          if (res.status === 200) {
            this.fetchShoppingItems();
          }
        })
    };
  }

  updateShoppingItem = async (id, bought, name, boughtBy) => {
    const variables = {
      input: {
        id,
        name,
        bought,
        updatedAt: moment.utc().format(dateTimeFormat)
      }
    };

    appSyncGraphQl(updateShoppingItem, variables)
      .then((res) => {
        if (res.status === 200) {
          this.fetchShoppingItems();
        }
      })
    // this.onModalClose();
  }

  deleteShoppingItem = (id) => {
    const variables = {
      input: {
        id
      }
    };

    appSyncGraphQl(deleteShoppingItem, variables)
      .then((res) => {
        if (res.status === 200) {
          this.fetchShoppingItems();
        }
      });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchShoppingItems().then(() => {
      this.setState({ refreshing: false });
    });
  }

  onClearAsExpense = async (price) => {
    this.setState({ refreshing: true });

    const expenseVariables = {
      input: {
        ammount: parseFloat(price),
        userId: this.props.homeContext.currentUser.id,
        homeId: this.props.homeContext.id,
        compensated: false,
        createdAt: moment.utc().format(dateTimeFormat),
        updatedAt: moment.utc().format(dateTimeFormat)
      }
    };

    const expense = await appSyncGraphQl(createExpense, expenseVariables)
      .then((res) => {
        if (res.status === 200) {
          this.props.homeContext.updateExpenses();
          return res.res.createExpense;
        }
      });

    Promise.all(this.state.shoppingCart.map(shoppingItem => {
      console.log('expense', expense);
      const variables = {
        input: {
          id: shoppingItem.id,
          boughtBy: expense.id,
          updatedAt: moment.utc().format(dateTimeFormat)
        }
      };
      appSyncGraphQl(updateShoppingItem, variables);
    })).then(() => {
      this.fetchShoppingItems().then(() => {
        this.setState({
          refreshing: false,
          shoppingCart: []
        });
      });
    })
  }

  onClearWithoutExpense = async () => {
    this.setState({ refreshing: true });

    Promise.all(this.state.shoppingCart.map(shoppingItem => {
      const variables = {
        input: {
          id: shoppingItem.id,
          boughtBy: this.props.homeContext.currentUser.id,
          updatedAt: moment.utc().format(dateTimeFormat)
        }
      };
      appSyncGraphQl(updateShoppingItem, variables);
    })).then(() => {
      this.fetchShoppingItems().then(() => {
        this.setState({ 
          refreshing: false,
          shoppingCart: []
        });
      });    
    })
  }

  renderItem = ({ item }) => {
    return (
      <ListItem
        id={item.id}
        text={item.name}
        item={item}
        refreshList={this._onRefresh}
        isShoppingItem={true}
        bought={item.bought}
        onItemPressed={this.onItemPressed}
        addToShoppingCart={this.addToShoppingCart}
        removeFromShoppingCart={this.removeFromShoppingCart}
        updateShoppingItem={this.updateShoppingItem}
        deleteItem={this.deleteShoppingItem}
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
      itemModalPresented: false
    });
  };

  onItemPressed = (item, id) => {
    this.setState({
      itemModalPresented: true,
      pressedItem: item,
      pressedItemId: id
    });
  };

  onShoppingBasketPress = () => {
    this.setState({
      cartModalPresented: true
    });
  };

  onModalCose = () => {
    this.setState({
      itemModalPresented: false,
      pressedItem: undefined,
      pressedItemId: undefined,
      cartModalPresented: false
    });
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
    const shoppingItems = this.state.shoppingItems;
    let shoppingItem = shoppingItems.filter(item => item.id === id )[0];

    const newShoppingCart = this.state.shoppingCart.concat(shoppingItem)
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
          <AddButton onPress={this.onAddShoppingItemPress}/>
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
          <TouchableOpacity onPress={this.onShoppingBasketPress}>
            <View style={styles.shoppingBasketWrapper}>
              {this.getNotificationNumber()}
              <Image source={require('../../../assets/images/shopping-basket.png')} style={styles.shoppingCartImageStyle} />
            </View>
          </TouchableOpacity>
          {shoppingCart}
        </View>
        <ShoppingItemModal
          showModal={this.state.itemModalPresented}
          saveInput={this.saveModalInput}
          onModalClose={this.onModalCose}
          item={this.state.pressedItem}
          id={this.state.pressedItemId}
          cartItems={this.state.shoppingCart}
          currentUser={this.props.homeContext.currentUser}
        />
        <ShoppingCartModal
          onModalClose={this.onModalCose}           
          showModal={this.state.cartModalPresented}
          shoppingItems={this.state.shoppingCart}
          onClearWithoutExpense={this.onClearWithoutExpense}
          onClearAsExpense={this.onClearAsExpense}
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
    right: 10,
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    backgroundColor: colorPalette.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },

  shoppingItemListWrapper: {
    flex: 1
  },

  shoppingCartImageStyle: {
    height: 24,
    width: 24,
    marginTop: 4,
    zIndex: 3
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
    zIndex: 0
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