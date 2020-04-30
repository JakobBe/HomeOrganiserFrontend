import React, { Component } from 'react';
import Router from './Router';
import HomeContextHolder from './contexts/HomeContextHolder';
console.disableYellowBox = true;

class App extends Component {
  render() {
    return (
      <HomeContextHolder>
        <Router/>
      </HomeContextHolder>
    );
  }
}


export default App;