import React, { Component } from 'react';
import { getHome, createSession } from '../RailsClient';
import { UserContext } from './UserContextHolder';
import { getHome2 } from '../graphql/queries/GetHome';
import { appSyncGraphQl } from '../AWSClient';
import { createUser } from '../graphql/mutations/CreateUser';
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
    home: undefined,
    sub: undefined,
  }

  updateSub = (sub) => {
    this.setState({
      sub
    });
  }

  createUserSession = async (sub) => {
    const res = await createSession(sub)
      .then((response) => response.json())
      .then((res) => {
        this.setState({
          currentUser: res.user
        });
        return res
      });
    
    // const variables = { id: "e326d21f-704d-4542-bd44-5e8f0286e2dc" }
    // const data = await appSyncGraphQl(getHome2, variables);
    await this.buildHomeContext(res.user.home_id)
    return res
  };

  buildHomeContext = async (homeId) => {
    await getHome(homeId)
      .then((response) => response.json())
      .then((res) => {
        this.setState({
          users: res.users,
          toDos: res.to_dos,
          events: res.events,
          shoppingItems: res.shopping_items,
          home: res.home
        })
        this.props.updateApp()
      });
  };

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
    this.props.updateApp();
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
            home: this.state.home,
            shoppingItems: this.state.shoppingItems,
            createUserSession: this.createUserSession,
            updateCurrentUser: this.updateCurrentUser,
            updateSub: this.updateSub,
            sub: this.state.sub
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