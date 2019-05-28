import React, { Component } from 'react';
import { ListView, View, RefreshControl, FlatList } from 'react-native';
import { Input, CardSection, Button, Footer, ListItem } from '../common';
import { fetchShoppingItems, createShoppingItem, updateShoppingItem } from '../Client';
import { UserContext } from '../contexts/UserContextHolder';
import ShoppingItemModal from './ShoppingItemModal';

class ShoppingList extends Component {
  state = { shoppingItems: [], refreshing: false, newShoppingItem: '', modalPresented: false, pressedItem: '', pressedItemId: undefined };

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
    return (
      <ListItem
        id={item.id}
        text={item.name}
        refreshList={this._onRefresh}
        isShoppingItem={true}
        onItemPressed={this.onItemPressed}
      />
    );
  };

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

  onModalCose = () => {
    if (this.state.modalPresented) {
      this.setState({
        modalPresented: false
      });
    };
  };

  render() {
    const extractKey = ({ id }) => id
    return (
      <View style={styles.shoppingListContainer}>
        <View style={styles.inputWrapper}>
          <Input
            value={this.state.newShoppingItem}
            onChangeText={value => this.setState({ newShoppingItem: value })}
            placeholder={'Shopping Item'}
            additionalInputStyles={styles.additionalInputStyles}
            autoFocus={true}
          />
          <Button onPress={this.onButtonPress} additionalButtonStyles={styles.additionalButtonStyle}>
            +
          </Button>
        </View>
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
        <ShoppingItemModal
          showModal={this.state.modalPresented}
          saveInput={this.saveModalInput}
          onModalClose={this.onModalCose}
          item={this.state.pressedItem}
          id={this.state.pressedItemId}
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
  }
}

export default (props) => (
  <UserContext.Consumer>
    {userContext => <ShoppingList {...props} userContext={userContext} />}
  </UserContext.Consumer>
);