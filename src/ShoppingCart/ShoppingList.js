import React, { Component } from 'react';
import { View, RefreshControl, FlatList, Text, Alert, Image, TouchableOpacity } from 'react-native';
import { Input, CardSection, Button, Footer, ListItem } from '../common';
import { fetchShoppingItems, createShoppingItem, updateShoppingItem } from '../Client';
import { UserContext } from '../contexts/UserContextHolder';
import ShoppingItemModal from './ShoppingItemModal';

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
    await fetchShoppingItems(this.props.userContext.user.id).then((response) => response.json())
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

      createShoppingItem(this.state.newShoppingItem, this.props.userContext.user.id);
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
    if (this.state.shoppingCart.filter(cartItem => { return cartItem === item }).length > 0) {
      return
    }

    return (
      <ListItem
        id={item.id}
        text={item.name}
        refreshList={this._onRefresh}
        isShoppingItem={true}
        onItemPressed={this.onItemPressed}
        addToShoppingCart={this.addToShoppingCart}
      />
    );
  };

  renderShoppingCartItem = ({ item }) => {
    return(
      <View style={styles.shoppingCartItem}>
        <Text>
          {item.name}
        </Text>
      </View>
    );
  }

  saveModalInput = (text, price, id) => {
    updateShoppingItem(id, text, price, this.props.userContext.user.id);
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
    // console.log('Inside shopping Bag');
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

  render() {
    const extractKey = ({ id }) => id
    const shoppingCart = this.getShoppingCart()
    // console.log('The Cart', shoppingCart);
    return (
      <View style={styles.shoppingListContainer}>
        <View style={styles.inputWrapper}>
          <Input
            value={this.state.newShoppingItem}
            onChangeText={value => this.setState({ newShoppingItem: value })}
            placeholder={'Shopping Item'}
            additionalInputStyles={styles.additionalInputStyles}
            autoFocus={false}
          />
          <Button onPress={this.onButtonPress} additionalButtonStyles={styles.additionalButtonStyle}>
            +
          </Button>
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
          <TouchableOpacity onPress={this.onShoppingBagPress}>
            <Image source={require('../../assets/images/shopping-bag.png')} style={styles.imageStyle} />
          </TouchableOpacity>
          {shoppingCart}
        </View>
        <ShoppingItemModal
          showModal={this.state.modalPresented}
          saveInput={this.saveModalInput}
          onModalClose={this.onModalCose}
          item={this.state.pressedItem}
          id={this.state.pressedItemId}
          cartItems={this.state.shoppingCart}
        />
        <Footer />
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
    // flex: 1,
    height: 300
  },
  additionalButtonStyle: {
    backgroundColor: '#05004e',
    marginTop: 5,
    height: 40,
    width: 40,
    borderRadius: 20
  },

  additionalCartButtonStyle: {
    backgroundColor: '#05004e',
    marginBottom: 5,
  },

  inputWrapper: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#05004e',
    marginRight: 5,
    marginLeft: 5,
    padding: 5
  },

  additionalInputStyles: {
    width: 300
  },

  shoppingContentWrapper: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },

  shoppingCartWrapper: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#05004e',
    flex: 1,
    padding: 5
  },

  shoppingItemListWrapper: {
    flex: 2
  },

  imageStyle: {
    height: 30,
    width: 30,
    padding: 10,
    position: 'absolute',
    top: 25,
    right: 25 
  },

  shoppingCartItem: {
    borderBottomWidth: 0.5,
    padding: 5,
  }
}

export default (props) => (
  <UserContext.Consumer>
    {userContext => <ShoppingList {...props} userContext={userContext} />}
  </UserContext.Consumer>
);