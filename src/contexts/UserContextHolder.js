import React, { Component } from 'react';
import { createSession } from '../RailsClient';
import moment from 'moment';
import {appSyncGraphQl} from '../AWSClient';
import {createUser} from '../graphql/mutations/CreateUser'

const defaultValue = {};
export const UserContext = React.createContext(defaultValue);

class UserContextHolder extends Component {

  state = {
    user: undefined
  }

  createUser = async (sub) => {
    const variables = {
      sub,
      name: "Anna",
      homeId: "e326d21f-704d-4542-bd44-5e8f0286e2dc",
      color: "pink",
      createdAt: moment.utc().format(),
    }
    const newUser = await appSyncGraphQl(createUser, variables);
    console.log('newUser', newUser);
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