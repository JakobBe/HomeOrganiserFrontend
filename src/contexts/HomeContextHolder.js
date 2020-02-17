import React, { Component } from 'react';
import { getHome, createSession } from '../RailsClient';
import { UserContext } from './UserContextHolder';
import { getHome2 } from '../graphql/Homes/queries';
import { appSyncGraphQl } from '../AWSClient';
import { getUserBySub } from '../graphql/Users/queries';
import { listEventsWithHomeId } from '../graphql/Events/queries';
import moment from 'moment';

const defaultValue = {};
export const HomeContext = React.createContext(defaultValue);

class HomeContextHolder extends Component {
  state = {
    currentUser: undefined,
    users: undefined,
    toDos: undefined,
    events: undefined,
    shoppingItems: undefined,
    name: undefined,
    id: undefined,
    sub: undefined,
  }

  updateSub = (sub) => {
    this.setState({
      sub
    });
  }

  createUserSession = async (sub) => {
    const variables = {
      sub
    }

    const currentUser = await appSyncGraphQl(getUserBySub, variables)
      .then((res) => {
        console.log('res from getting GraphQLUser', res);
        if (res.status === 200) {
          this.setState({
            currentUser: res.res.listUsers.items[0]
          });
          return res.res.listUsers.items[0]
        } else if (res.status === 400) {
        }
      })

    await this.buildHomeContext(currentUser.homeId)
  };

  buildHomeContext = async (homeId) => {
    const variables = {
      id: homeId
    };

    await appSyncGraphQl(getHome2, variables)
      .then((res) => {
        console.log('Home from context', res);
        if (res.status === 200) {
          const home = res.res.getHome;
          this.setState({
            users: home.users.items,
            toDos: home.toDos,
            events: home.events.items,
            shoppingItems: home.shoppingItems,
            name: home.name,
            id: home.id
          });
          this.props.updateApp()
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
            createUserSession: this.createUserSession,
            updateCurrentUser: this.updateCurrentUser,
            updateSub: this.updateSub,
            sub: this.state.sub,
            updateEvents: this.updateEvents
          }
        }
      >
        {this.props.children}
      </HomeContext.Provider>
    );
  };
};

export default (props) => (
  <UserContext.Consumer>
    {userContext => <HomeContextHolder {...props} userContext={userContext} />}
  </UserContext.Consumer>
);