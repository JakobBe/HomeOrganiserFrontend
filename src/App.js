import React, { Component } from 'react';
import Router from './Router';
import UserContextHolder from './contexts/UserContextHolder';
import HomeContextHolder from './contexts/HomeContextHolder';
console.disableYellowBox = true;
class App extends Component {
  state = {
    update: false
  }

  updateApp = () => {
    this.setState({
      update: !this.state.update
    })
  } 

  render() {
    console.log('RENDER');
    return (
      <UserContextHolder
        updateApp={this.updateApp}
      >
        <HomeContextHolder
          updateApp={this.updateApp}
        >
          <Router />
        </HomeContextHolder>
      </UserContextHolder>
    );
  }
}


export default App;