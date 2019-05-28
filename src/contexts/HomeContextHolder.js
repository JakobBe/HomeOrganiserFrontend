import React, { Component } from 'react';
import { getHome } from '../Client';

const defaultValue = {};
export const HomeContext = React.createContext(defaultValue);

class HomeContextHolder extends Component {
  state = {
    users: undefined,
    toDos: undefined,
    events: undefined,
    shoppingItems: undefined,
    home: undefined
  }

  buildHomeContext = async () => {
    const res = await getHome(this.props.user.home_id)
      .then((response) => response.json())
      .then((res) => {
        console.log('log the user', res.users);
        this.setState({
          users: res.users,
          toDos: res.to_dos,
          events: res.events,
          shoppingItems: res.shopping_items,
          home: res.home
        })
      });
    return res;
  };

  render() {
    if (this.props.user !== undefined && this.state.home === undefined) {
      this.buildHomeContext();
    };

    return (
      <HomeContext.Provider
        value={
          {
            users: this.state.users,
            toDos: this.state.toDos,
            events: this.state.events,
            shoppingItems: this.state.shoppingItems
          }
        }
      >
        {this.props.children}
      </HomeContext.Provider>
    );
  };
};

export default HomeContextHolder;