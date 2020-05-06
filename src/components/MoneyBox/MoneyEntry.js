import React, { Component } from 'react';
import { Text, View, FlatList, Linking, TouchableOpacity, Image } from 'react-native';
import { Button, HorizontalSeperater, CardSection, Footer, ListItem } from '../Common';
import { createExpense, deleteExpense, updateExpense } from '../../graphql/Expenses/mutations';
import { appSyncGraphQl } from '../../AWSClient';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { colorPalette } from '../../Style/Colors';
import { valueFormatter } from '../../Helpers/valueFormatter';
import { sortByCreatedAt } from '../../Helpers/sortByDate';
import ExpenseModal from './ExpenseModal';

class MoneyEntry extends Component {
  state = {
    newSaving: '',
    expenses: [],
    isExpenseModalVisible: false,
    expenseModalInfo: {
      expense: {},
      relevantShoppingItems: [],
      user: {}
    },
  }

  componentDidMount() {
    const expenses = this.props.homeContext.expenses;
    const sortedExpenses = sortByCreatedAt(expenses);

    this.setState({
      expenses: sortedExpenses
    });
  }

  fetchExpenses = async () => {
    await fetchExpenses(1).then((response) => response.json())
      .then((res) => {
          this.setState({
            expenses: res
          });
      })
  }

  onResetAllPress = async () => {
    this.state.expenses.map(expense => {
      updateExpense(expense.id)
    })
  }

  getUserExpenseBalacne = () => {
    let balance = 0;
    // this.state.expenses.map(expense => {
    //   if (expense.user_id === this.props.userContext.user.id) {
    //     balance += expense.amount
    //   };
    //   if (expense.user_id !== this.props.userContext.user.id) {
    //     balance -= expense.amount
    //   };
    // })

    return balance;
  }

  onPiggybankPress = () => {
    Linking.openURL('https://paypal.me/pools/c/8fwKiG9XxM')
  }

  getPayPalLinks = () => {
  //  return this.props.homeContext.users.map(user => {
  //    return (
  //       <TouchableOpacity onPress={() => this.onPayPalPress(user)}>
  //         <Text style={styles.paypalText}>
  //           {`PayPal ${user.name}`}
  //         </Text>
  //       </TouchableOpacity>
  //    )
  //   })
  }

  onItemPressed = (id) => {
    const relevantShoppingItems = this.props.homeContext.shoppingItems.filter(item => item.boughtBy === id);
    const expense = this.state.expenses.find(expense => expense.id === id);
    const user = this.props.homeContext.users.find(user => user.id === expense.userId);

    this.setState({
      expenseModalInfo: {
        relevantShoppingItems,
        expense,
        user
      },
      isExpenseModalVisible: true
    })
  }

  onExpenseModalClose = () => {
    this.setState({
      expenseModalInfo: {
        relevantShoppingItems: [],
        expense: {},
        user: {}
      },
      isExpenseModalVisible: false
    })
  }

  onPayPalPress = (user) => {
    Linking.openURL(`https://${user.pay_pal_me_link}`)
  }

  renderItem = ({ item }) => {
    const user = this.props.homeContext.users.find(user => user.id === item.userId);
    return (
      <ListItem
        id={item.id}
        text={`${valueFormatter(item.ammount, 'EUR')}`}
        date={item.createdAt}
        isExpense={true}
        userColor={user.color}
        textColor={colorPalette.primary}
        backgroundColor={colorPalette.secondary}
        userName={user.name}
        onItemPressed={this.onItemPressed}
      />
    );
  };

  render() {
    console.log('this.state', this.state);
    const extractKey = ({ id }) => id
    return (
      <View style={styles.moneyBoxContainer}>
        <View style={styles.balanceWrapper}>
          <Text style={styles.balanceTextStyle(colorPalette.primary)}>
            Your Balance is {this.getUserExpenseBalacne()}$
          </Text>
          <Button 
            additionalButtonStyles={styles.additionalButtonStyles} 
            additionalButtonTextStyles={styles.additionalButtonTextStyles}
            onPress={this.onResetAllPress}
          >
            Reset Balance
          </Button>
        </View>
        {/* <View style={styles.payPalWrapper}>
          <Image source={require('../../../assets/images/PayPalLogo.png')} style={styles.paypalImageStyle}/>
          {this.getPayPalLinks()}
        </View> */}
        <FlatList
          data={this.state.expenses}
          renderRow={this.renderRow}
          renderItem={this.renderItem}
          keyExtractor={extractKey}
        />
        <ExpenseModal
          isVisible={this.state.isExpenseModalVisible}
          expenseModalInfo={this.state.expenseModalInfo}
          onModalClose={this.onExpenseModalClose}
        />
        <Footer isMoneyboxActive={true}/>
      </View>
    );
  }
}

const styles = {
  moneyBoxContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colorPalette.secondary
  },

  balanceWrapper: {
    flex: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 20,
    marginTop: 70,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: colorPalette.primary
  },
  
  balanceTextStyle: (color) => ({
    justifyContent: 'center',
    alignItems: 'center',
    color,
    fontWeight: 'bold' 
  }),

  additionalButtonStyles: {
    backgroundColor: colorPalette.primary,
    marginTop: 20
  },

  additionalButtonTextStyles: {
    color: colorPalette.secondary
  },

  payPalWrapper: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    margin: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: colorPalette.primary
  },

  paypalImageStyle: {
    width: 200,
    height: 50
  },

  paypalText: {
    color: 'blue',
    textDecorationLine: 'underline' ,
    padding: 10
  }
};

export default (props) => (
  <UserContext.Consumer>
    {userContext => 
      <HomeContext.Consumer>
        {homeContext => <MoneyEntry {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);
