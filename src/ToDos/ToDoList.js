import React, { Component } from 'react';
import { FlatList, View, RefreshControl, Text, TouchableWithoutFeedback, Image } from 'react-native';
import { AddButton, Footer, ListItem } from '../Common';
import { fetchUserToDos, filterToDos } from '../RailsClient';
import { UserContext } from '../contexts/UserContextHolder';
import ToDoFilterModal from './ToDoFilterModal';
import ToDoModal from './ToDoModal';
import { HomeContext } from '../contexts/HomeContextHolder';

class ToDoList extends Component {
  state = { 
    toDos: [], 
    refreshing: false, 
    filterModalPresented: false,
    toDoModalPresented: false
  };

  componentWillMount() {
    this.fetchUserToDos();
  }

  fetchUserToDos = async () => {
    await fetchUserToDos(this.props.homeContext.currentUser.id).then((response) => response.json())
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
      filterModalPresented: true
    });
  };

  onAddToDoPress = () => {
    this.setState({
      toDoModalPresented: true
    });
  }

  onModalCose = () => {
    if (this.state.filterModalPresented) {
      this.setState({
        filterModalPresented: false
      });
    };

    if (this.state.toDoModalPresented) {
      this.setState({
        toDoModalPresented: false
      });
    };
  };

  onFilterToDosPress = async (info) => {
    if (info === 'undone') {
      await filterToDos(info, this.props.homeContext.currentUser.id)
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            toDos: res,
            filterModalPresented: false
          });
        });
    };
    if (info === 'done') {
      await filterToDos(info, this.props.homeContext.currentUser.id)
        .then((response) => response.json())
        .then((res) => {
          this.setState({
            toDos: res,
            filterModalPresented: false
          });
        });
    };
    if (info === 'all') {
      this._onRefresh();
      this.setState({
        filterModalPresented: false
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
        <AddButton onPress={this.onAddToDoPress} additionalButtonStyles={styles.additionalAddButtonStyle}/>
        <TouchableWithoutFeedback onPress={() => this.onFilterMenuPress()}>
          <Image source={require('../../assets/images/filter-outline.png')} style={styles.jarImageStyle} />
        </TouchableWithoutFeedback>
        <FlatList
          style={styles.flatList}
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
          showFilterModal={this.state.filterModalPresented}
          onModalClose={this.onModalCose}
          onFilterToDosPress={this.onFilterToDosPress}
        />
        <ToDoModal 
          showModal={this.state.toDoModalPresented}
          onModalClose={this.onModalCose}
        />
        <Footer isCleaningActive={true}/>
      </View>
    );
  }
};

const styles = {
  toDoContainer: {
    flex: 1,
    justifiyContent: 'space-between',
    backgroundColor: 'rgb(255,255,255)',
    position: 'relative'
  },

  flatList: {
    marginTop: 15
  },

  jarImageStyle: {
    position: 'absolute',
    top: 7,
    right: 10,
    zIndex: 2,
    height: 28,
    width: 28,
  },

  additionalAddButtonStyle: {
    position: 'absolute',
    top: 1.5,
    right: 47,
    zIndex: 2
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