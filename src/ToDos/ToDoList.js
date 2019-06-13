import React, { Component } from 'react';
import { FlatList, View, RefreshControl, Text, TouchableWithoutFeedback, Image } from 'react-native';
import { Input, CardSection, Button, Footer, ListItem } from '../common';
import { fetchUserToDos, filterToDos } from '../Client';
import { UserContext } from '../contexts/UserContextHolder';
import ToDoFilterModal from './ToDoFilterModal';
import { HomeContext } from '../contexts/HomeContextHolder';

class ToDoList extends Component {
  state = { toDos: [], refreshing: false, modalPresented: false };

  componentWillMount() {
    this.fetchUserToDos();
  }

  fetchUserToDos = async () => {
    await fetchUserToDos(this.props.userContext.user.id).then((response) => response.json())
      .then((res) => { if (res.length !== this.state.toDos.length) {
        this.setState({
          toDos: res
        });
      }})
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchUserToDos().then(() => {
      this.setState({ refreshing: false });
    });
  };

  onFilterMenuPress = () => {
    this.setState({
      modalPresented: true
    });
  };

  onModalCose = () => {
    if (this.state.modalPresented) {
      this.setState({
        modalPresented: false
      });
    };
  };

  onFilterToDosPress = async (info) => {
    if (info === 'undone') {
      await filterToDos(info, this.props.userContext.user.id)
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            toDos: res,
            modalPresented: false
          });
        });
    };
    if (info === 'done') {
      await filterToDos(info, this.props.userContext.user.id)
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            toDos: res,
            modalPresented: false
          });
        });
    };
    if (info === 'all') {
      this._onRefresh();
      this.setState({
        modalPresented: false
      });
    };
  };

  renderItem = ({ item }) => {
    let homeUsers = undefined;
    let itemUser = undefined;
    let appointerUser = undefined;
    let userColor = undefined;
    let appointerColor = undefined;
    let userName = undefined;

    if (item.appointee !== 'all') {
      homeUsers = this.props.homeContext.users
      itemUser = homeUsers.filter(user => user.id === Number.parseInt(item.appointee))
      appointerUser = homeUsers.filter(user => user.id === item.user_id)[0]
      userColor = itemUser[0].color
      appointerColor = appointerUser.color
      userName = itemUser[0].name
    }

    if (item.appointee === 'all') {
      homeUsers = this.props.homeContext.users
      appointerUser = homeUsers.filter(user => user.id === item.user_id)[0]
      userColor = 'green'
      userName = 'A'
      appointerColor = appointerUser.color
    }
    
    return (
      <ListItem
        id={item.id}
        description={item.user_name}
        date={item.due_date}
        text={item.task}
        refreshList={this._onRefresh}
        isToDo={true}
        userName={userName}
        done={item.done}
        userColor={userColor}
        appointerColor={appointerColor}
      />
    );
  };

  render() {
    const extractKey = ({ id }) => id
    return (
      <View style={styles.toDoContainer}>
        <TouchableWithoutFeedback onPress={() => this.onFilterMenuPress()}>
          <View style={styles.subHeader}>
            <Image source={require('../../assets/images/filter-outline.png')} style={styles.jarImageStyle} />
          </View>
        </TouchableWithoutFeedback>
        <FlatList
          data={this.state.toDos}
          renderRow={this.renderRow}
          renderItem={this.renderItem}
          keyExtractor={extractKey}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        />
        <ToDoFilterModal
          showModal={this.state.modalPresented}
          onModalClose={this.onModalCose}
          onFilterToDosPress={this.onFilterToDosPress}
        />
        <Footer />
      </View>
    );
  }
};

const styles = {
  toDoContainer: {
    flex: 1,
    justifiyContent: 'space-between',
    backgroundColor: 'rgb(255,255,255)'
  },

  subHeader: {
    felx: 0,
    justifiyContent: 'center',
    alignItems: 'flex-end',
    margin: 10
  },

  jarImageStyle: {
    height: 15,
    width: 15,
  }
}

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
          {homeContext => <ToDoList {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);