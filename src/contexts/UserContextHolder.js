import React, { Component } from 'react';
import { createSession } from '../Client';

const defaultValue = {};
export const UserContext = React.createContext(defaultValue);

class UserContextHolder extends Component {

  onLoginButtonPress = async (email, password) => {
    const res = await createSession(email, password)
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 'Logged In') {
          this.props.setUser(res.user);
          return res
        } else if (res.status === 'Email or password is invalid') {
          return res
        }
      });
    return res
  };

  render() {
    return (
      <UserContext.Provider
        value={
          {
            user: this.props.user,
            onLoginButtonPress: this.onLoginButtonPress
          }
        }
      >
        {this.props.children} 
      </UserContext.Provider>
    );
  };
};

export default UserContextHolder;