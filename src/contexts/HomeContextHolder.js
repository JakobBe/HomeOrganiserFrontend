import React, { Component } from 'react';
import { Actions, ActionConst } from 'react-native-router-flux';
import { getHome2 } from '../graphql/Homes/queries';
import { appSyncGraphQl } from '../AWSClient';
import { getUserBySub } from '../graphql/Users/queries';
import { listEventsWithHomeId } from '../graphql/Events/queries';
import { listToDosWithHomeId } from '../graphql/ToDos/queries';
import { listShoppingItemsWithHomeId } from '../graphql/ShoppingItems/queries';
import { listExpensesWithHomeId } from '../graphql/Expenses/queries';

const defaultValue = {};
export const HomeContext = React.createContext(defaultValue);

class HomeContextHolder extends Component {
  state = {
    currentUser: undefined,
    users: undefined,
    toDos: undefined,
    events: undefined,
    shoppingItems: undefined,
    expenses: undefined,
    name: undefined,
    id: undefined,
    sub: undefined,
  }

  updateSub = (sub) => {
    this.setState({
      sub
    });
  }

  createUserSession = async (info) => {
    let currentUser = info;
    if (info.id === undefined) { 
      const variables = {
        sub: info
      }
      await appSyncGraphQl(getUserBySub, variables)
        .then((res) => {
          if (res.status === 200) {
            currentUser = res.res.listUsers.items[0];
            if (res.res.listUsers.items.length === 0) {
              currentUser = undefined;
            }
          } else if (res.status === 400) {
            currentUser = undefined;
          }
        })
    }

    this.setState({
      currentUser
    });
    return currentUser;
    // await this.buildHomeContext(currentUser.homeId)
  };

  buildHomeContext = async (homeId) => {
    const variables = {
      id: homeId
    };

    await appSyncGraphQl(getHome2, variables)
      .then((res) => {
        console.log('res from building home Context', res);
        if (res.status === 200) {
          const home = res.res.getHome;
          this.setState({
            users: home.users.items,
            toDos: home.toDos.items,
            events: home.events.items,
            shoppingItems: home.shoppingItems.items,
            expenses: home.expenses.items,
            name: home.name,
            id: home.id
          });
          Actions.entry({ type: ActionConst.REPLACE })
        } else if (res.status === 400) {
        }
      });
  };

  updateEvents = async () => {
    const variables = {
      homeId: this.state.id
    };

    const events = await appSyncGraphQl(listEventsWithHomeId, variables)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            events: res.res.listEvents.items
          });
          return res.res.listEvents.items;
        } else if (res.status === 400) {
          return [];
        }
      })
    return events;
  }

  updateToDos = async () => {
    const variables = {
      homeId: this.state.id
    };

    const toDos = await appSyncGraphQl(listToDosWithHomeId, variables)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            toDos: res.res.listToDos.items
          });
          return res.res.listToDos.items;
        } else if (res.status === 400) {
          return [];
        }
      })
    return toDos;
  }

  updateShoppingItems = async () => {
    const variables = {
      homeId: this.state.id,
      boughtBy: '00000000-0000-0000-0000-000000000000',
      limit: 100,
      sort: {
        field: 'createdAt',
        direction: 'desc'
      }
    };

    const sort = {
      field: 'createdAt',
      direction: 'asc'
    };

    const limit = 1;

    const shoppingItems = await appSyncGraphQl(listShoppingItemsWithHomeId, variables, limit)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            shoppingItems: res.res.listShoppingItems.items
          });
          return res.res.listShoppingItems.items;
        } else if (res.status === 400) {
          return [];
        }
      })
    return shoppingItems;
  }

  updateExpenses = async () => {
    const variables = {
      homeId: this.state.id
    };
  
    const expenses = await appSyncGraphQl(listExpensesWithHomeId, variables)
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            expenses: res.res.listExpenses.items
          });
          return res.res.listExpenses.items;
        } else if (res.status === 400) {
          return [];
        }
      })
      return expenses;
  }


  updateCurrentUser = async (currentUser) => {
    let users = this.state.users;
    const userIndex = users.indexOf(users.filter(user => user.id === currentUser.id)[0]);

    if (userIndex !== -1) {
      users[userIndex] = currentUser
    };

    this.setState({
      currentUser,
      users
    });
  }

  logout = () => {
    this.setState({
      currentUser: undefined,
      users: undefined,
      toDos: undefined,
      events: undefined,
      shoppingItems: undefined,
      expenses: undefined,
      name: undefined,
      id: undefined,
      sub: undefined,
    });
  }

  render() {
    return (
      <HomeContext.Provider
        value={
          {
            currentUser: this.state.currentUser,
            users: this.state.users,
            toDos: this.state.toDos,
            events: this.state.events,
            name: this.state.name,
            id: this.state.id,
            shoppingItems: this.state.shoppingItems,
            expenses: this.state.expenses,
            createUserSession: this.createUserSession,
            updateCurrentUser: this.updateCurrentUser,
            updateSub: this.updateSub,
            sub: this.state.sub,
            updateEvents: this.updateEvents,
            updateToDos: this.updateToDos,
            updateShoppingItems: this.updateShoppingItems,
            updateExpenses: this.updateExpenses,
            buildHomeContext: this.buildHomeContext,
            logout: this.logout
          }
        }
      >
        {this.props.children}
      </HomeContext.Provider>
    );
  };
};

export default HomeContextHolder;

// export default (props) => (
//   <UserContext.Consumer>
//     {userContext => <HomeContextHolder {...props} userContext={userContext} />}
//   </UserContext.Consumer>
// );