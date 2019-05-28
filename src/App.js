import React, { Component } from 'react';
import Router from './Router';
import UserContextHolder from './contexts/UserContextHolder';
import HomeContextHolder from './contexts/HomeContextHolder';
import { createSession } from './Client';

class App extends Component {
  state = {
    user: undefined
  }

  setUser = (user) => {
    this.setState({
      user
    });
  };

  render() {
    console.log('rerender with user', this.state);
    return (
      <UserContextHolder
        user={this.state.user}
        setUser={this.setUser}
      >
        <HomeContextHolder
          user={this.state.user}
        >
          <Router />
        </HomeContextHolder>
      </UserContextHolder>
    );
  }
}

export default App