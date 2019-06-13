import React, { Component } from 'react';
import { TextInput, Text, View, FlatList, Linking } from 'react-native';
import { Card, Button, HorizontalSeperater, Input, CardSection, Footer, ListItem } from '../common';
import { fetchExpenses } from '../Client';
import { UserContext } from '../contexts/UserContextHolder';

class MoneyEntry extends Component {
  state = {
    newSaving: '',
    expenses: []
  }

  componentWillMount() {
    this.fetchExpenses();
  }

  fetchExpenses = async () => {
    await fetchExpenses(1).then((response) => response.json())
      .then((res) => {
          this.setState({
            expenses: res
          });
      })
  }

  getUserExpenseBalacne = () => {
    let balance = 0;
    this.state.expenses.map(expense => {
      if (expense.user_id === this.props.userContext.user.id) {
        balance += expense.amount
      };
      if (expense.user_id !== this.props.userContext.user.id) {
        balance -= expense.amount
      };
    })

    return balance;
  }

  renderItem = ({ item }) => {

    return (
      <ListItem
        id={item.id}
        text={`${item.user_id} paid ${item.amount}.00$`}
        date={item.created_at}
        isExpense={true}
      />
    );
  };

  render() {
    console.log(this.props.userContext.user.pay_pal_me_link);
    const extractKey = ({ id }) => id
    return (
      <View style={styles.moneyBoxContainer}>
        <CardSection additionalCardSectionStyles={styles.inputWrapper}>
          <Text style={styles.balanceTextStyle}>
            Your Balance is {this.getUserExpenseBalacne()}$
          </Text>
          {/* <Input
            value={this.state.newSaving}
            onChangeText={value => this.setState({ newSaving: value })}
            placeholder={'xxx,xx$'}
          /> */}
          <Button additionalButtonStyles={styles.button}>
            Reset Balance
          </Button>
        </CardSection>
        <View style={styles.moneyBoxBox}>
          <Text style={styles.moneyBoxAmount}
            onPress={() => Linking.openURL('https://paypal.me/pools/c/8fwKiG9XxM')}
          >
            Here is the MoneyPool
          </Text>
        </View>
        <Text style={{ color: 'blue' }}
          onPress={() => Linking.openURL(`https://${this.props.userContext.user.pay_pal_me_link}`)}>
          PayPal Jakob
        </Text>
        <HorizontalSeperater />
        <FlatList
          data={this.state.expenses}
          renderRow={this.renderRow}
          renderItem={this.renderItem}
          keyExtractor={extractKey}
        />
        <Footer />
      </View>
    );
  }
}

const styles = {
  button: {
    height: 40,
    backgroundColor: '#05004e',
    marginTop: 10,
    alignItems: 'center',
    padding: 10
  },

  moneyBoxAmount: {
    fontSize: 50,
    color: '#fd5f00'
  },

  moneyBoxBox: {
    borderWidth: 2,
    borderRadius: 10000,
    borderColor: '#05004e',
    shadowColor: '#05004e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },

  moneyBoxInput: {
    height: 35,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },

  inputWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },

  moneyBoxContainer: {
    backgroundColor: '#a9eec2',
    flex: 1,
    justifyContent: 'space-between'
  },

  balanceTextStyle: {
    width: 120,
    backgroundColor: '#c40018',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    color: 'white',
    fontWeight: 'bold' 
  },
};

export default (props) => (
  <UserContext.Consumer>
    {userContext => <MoneyEntry {...props} userContext={userContext} />}
  </UserContext.Consumer>
);