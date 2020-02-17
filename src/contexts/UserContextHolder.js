import React, { Component } from 'react';
import { createSession } from '../RailsClient';
import moment from 'moment';
import {appSyncGraphQl} from '../AWSClient';

const defaultValue = {};
export const UserContext = React.createContext(defaultValue);

class UserContextHolder extends Component {

  state = {
    user: undefined
  }

  createUserSession = async (sub) => {
    this.createUser(sub)
    const res = await createSession(sub)
      .then((response) => response.json())
      .then((res) => {
        this.setState({
          user: res.user
        });
        this.props.updateApp()
        return res
      });
    return res
  };

  updateUser = async (user) => {
    console.log('user', user);
    this.setState({
      user
    });
    this.props.updateApp();
  }

  render() {
    return (
      <UserContext.Provider
        value={
          {
            user: this.state.user,
            createUserSession: this.createUserSession,
            updateUser: this.updateUser
          }
        }
      >
        {this.props.children} 
      </UserContext.Provider>
    );
  };
};

export default UserContextHolder;