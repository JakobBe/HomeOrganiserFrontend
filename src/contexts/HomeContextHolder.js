import React, { Component } from 'react';
import { getHome, createSession } from '../RailsClient';
import { UserContext } from './UserContextHolder';

const defaultValue = {};
export const HomeContext = React.createContext(defaultValue);

class HomeContextHolder extends Component {
  state = {
    currentUser: undefined,
    users: undefined,
    toDos: undefined,
    events: undefined,
    shoppingItems: undefined,
    home: undefined
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
    console.log('this.state', this.state);
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
            updateCurrentUser: this.updateCurrentUser
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