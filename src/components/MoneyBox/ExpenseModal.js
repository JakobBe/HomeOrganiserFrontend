import React from 'react';
import { View, Modal, Text, FlatList } from 'react-native';
import { CloseButton } from '../Common';
import { colorPalette, layouts } from '../../Style';
import { valueFormatter } from '../../Helpers/valueFormatter';

const ExpenseModal = (props) => {
  getShoppingItemList = (relevantShoppingItems) => {
    const extractKey = ({ id }) => id;
    if (relevantShoppingItems.length === 0) {
      return;
    }

    return (
      <View style={styles.expenseModalItemWrapper}>
        <Text>
          Shopping items bought:
        </Text>
        <FlatList
          data={relevantShoppingItems}
          renderRow={this.renderRow}
          renderItem={this.renderItem}
          keyExtractor={extractKey}
        />
      </View>
    );
  }

  renderItem = ({ item }) => {
    return (
      <View style={styles.shoppingItemWrapper}>
        <Text style={styles.shoppingItemText}>
          - {item.name}
        </Text>
      </View>
    );
  }

  getInfo = (expense, user) => {
    return (
      <View>
        <View>
          <View style={layouts.centerWrapper}>
            <Text style={styles.expenseModalHeader}>
              {valueFormatter(expense.ammount, 'EUR')}
            </Text>
          </View>
          <Text>
            {user.name} | {valueFormatter(expense.createdAt, 'day')}
          </Text>
          <Text>
            
          </Text>
        </View>
      </View>
    );
  }

    const { relevantShoppingItems, expense, user } = props.expenseModalInfo;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.isVisible}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.expenseModalContainer}>
            <CloseButton onPress={props.onModalClose} />
            {getInfo(expense, user)}
            {getShoppingItemList(relevantShoppingItems)}
          </View>
        </View>
      </Modal>
    )
};

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  expenseModalContainer: {
    margin: 30,
    marginTop: 110,
    marginBottom: 110,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
    // height: 'fit-content'
  },

  expenseModalItemWrapper: {
    flex: 0,
  },

  shoppingItemWrapper: {
    height: 20,
    marginBottom: 10,
    marginLeft: 10
  },

  shoppingItemText: {
    color: 'green'
  },

  expenseModalHeader: {
    fontSize: 25,
    fontWeight: 'bold'
  }
};

export default ExpenseModal;