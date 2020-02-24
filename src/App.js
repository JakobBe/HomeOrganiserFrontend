import React, { Component } from 'react';
import Router from './Router';
import UserContextHolder from './contexts/UserContextHolder';
import HomeContextHolder from './contexts/HomeContextHolder';
console.disableYellowBox = true;
class App extends Component {
  render() {
    console.log('RENDER');
    return (
      <HomeContextHolder>
        <Router />
      </HomeContextHolder>
    );
  }
}


export default App;