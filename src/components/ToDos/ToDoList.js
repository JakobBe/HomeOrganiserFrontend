import React, { Component } from 'react';
import { FlatList, View, RefreshControl, Text, TouchableOpacity, Image, Keyboard } from 'react-native';
import { AddButton, Footer, ListItem, Input } from '../Common';
import { fetchUserToDos, filterToDos } from '../../RailsClient';
import { UserContext } from '../../contexts/UserContextHolder';
import ToDoFilterModal from './ToDoFilterModal';
import ToDoModal from './ToDoModal';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { dateTimeFormat } from '../../Helpers/magicNumbers';
import { createToDo, deleteToDo, updateToDo } from '../../graphql/ToDos/mutations';
import { appSyncGraphQl } from '../../AWSClient';
import { sortByCreatedAt } from '../../Helpers/sortByDate';
import { colorPalette, layouts } from '../../Style';
import moment from 'moment';

class ToDoList extends Component {
  state = { 
    toDos: [], 
    refreshing: false, 
    filterModalPresented: false,
    filter: 'all',
    toDoModalPresented: false,
    newToDo: '',
    modalValue: undefined
  };

  componentWillMount() {
    const toDos = sortByCreatedAt(this.props.homeContext.toDos);
    this.setState({
      toDos
    });
  }

  fetchToDos = async () => {
    let toDos = await this.props.homeContext.updateToDos();

    if (this.state.filter !== 'all') {
      toDos = toDos.filter(toDo => toDo.done === this.state.filter);
    }

    toDos = sortByCreatedAt(toDos);

    this.setState({
      toDos
    });
  }

  updateToDo = async (id, done, task, appointee) => {
    const variables = {
      input: {
        id,
        task,
        done,
        appointee,
        updatedAt: moment.utc().format(dateTimeFormat)
      }
    };

    appSyncGraphQl(updateToDo, variables)
      .then((res) => {
        if (res.status === 200) {
          this.fetchToDos();
        }
      })
    this.onModalClose();
  }

  deleteToDo = (id) => {
    const variables = {
      input: {
        id
      }
    };

    appSyncGraphQl(deleteToDo, variables)
      .then((res) => {
        if (res.status === 200) {
          this.fetchToDos();
        }
      });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchToDos().then(() => {
      this.setState({ refreshing: false });
    });
  };

  onFilterMenuPress = () => {
    this.setState({
      filterModalPresented: true
    });
  };

  onAddToDoPress = () => {
    Keyboard.dismiss();
    if (this.state.newToDo.length > 0) {
      this.setState(({
        newToDo: ''
      }));

      const variables = {
        input: {
          task: this.state.newToDo,
          done: false,
          appointee: this.props.homeContext.currentUser.id,
          userId: this.props.homeContext.currentUser.id,
          homeId: this.props.homeContext.id,
          createdAt: moment.utc().format(dateTimeFormat),
          updatedAt: moment.utc().format(dateTimeFormat)
        }
      };
      appSyncGraphQl(createToDo, variables)
        .then((res) => {
          if (res.status === 200) {
            this.fetchToDos();
          }
        })
    };
  }

  onItemPressed = (itemId) => {
    this.setState({
      modalValue: this.state.toDos.filter(toDo => toDo.id === itemId)[0],
      toDoModalPresented: true
    })
  }

  onFilterToDosPress = async (info) => {
    this.onModalClose();
    let toDos = this.props.homeContext.toDos
    
    if (info === 'all') {
      this.setState({
        toDos,
        filter: info
      });
      return;
    };
    
    toDos = toDos.filter(toDo => toDo.done === info);
    this.setState({
      toDos,
      filter: info
    });
  };
  
  onModalClose = () => {
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

  renderItem = ({ item }) => {
    let appointerUser = undefined;
    let userColor = undefined;
    let appointerColor = undefined;
    let userName = undefined;

    const { currentUser, users } = this.props.homeContext;
    const itemUserId = item.userId;
    const itemUser = currentUser.id === itemUserId ? currentUser : users.filter(user => user.id === itemUserId)[0];
    userColor = itemUser.color
    userName = itemUser.name

    // if (item.appointee === 'all') {
    //   homeUsers = this.props.homeContext.users
    //   appointerUser = homeUsers.filter(user => user.id === item.user_id)[0]
    //   userColor = 'green'
    //   userName = 'A'
    //   appointerColor = appointerUser.color
    // }
    
    return (
      <ListItem
        id={item.id}
        appointee={item.appointee}
        description={userName}
        date={item.dueDate}
        text={item.task}
        refreshList={this._onRefresh}
        isToDo={true}
        userName={userName}
        done={item.done}
        userColor={userColor}
        appointerColor={userColor}
        updateToDo={this.updateToDo}
        deleteItem={this.deleteToDo}
        onItemPressed={this.onItemPressed}
      />
    );
  };

  render() {
    const extractKey = ({ id }) => id
    return (
      <View style={styles.toDoContainer}>
        <View style={styles.inputWrapper}>
          <Input
            value={this.state.newToDo}
            onChangeText={value => this.setState({ newToDo: value })}
            placeholder={'ToDo'}
            additionalInputStyles={styles.additionalInputStyles}
            additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
            autoFocus={false}
          />
          <AddButton onPress={this.onAddToDoPress} />
        </View>
        <View style={styles.toDoListWrapper}>
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
          <TouchableOpacity onPress={() => this.onFilterMenuPress()}>
            <View style={styles.filterImageWrapper}>
              <Image source={require('../../../assets/images/filter-outline.png')} style={styles.filterImageStyle} />
            </View>
          </TouchableOpacity>
        </View>
        <ToDoFilterModal
          showFilterModal={this.state.filterModalPresented}
          onModalClose={this.onModalClose}
          onFilterToDosPress={this.onFilterToDosPress}
          />
        {
          this.state.modalValue ? 
          <ToDoModal 
            showModal={this.state.toDoModalPresented}
            onModalClose={this.onModalClose}
            modalValue={this.state.modalValue}
            updateToDo={this.updateToDo}
          /> : null
        }
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
  },

  inputWrapper: {
    backgroundColor: 'rgba(240,240,240,.9)',
    borderRadius: 20,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 2,
    margin: 10,
    marginTop: 5,
    marginBottom: -10
  },

  additionalInputStyles: {
    flexGrow: 1,
    marginTop: 0,
    maxWidth: '85%'
  },

  flatList: {
    marginTop: 15
  },

  filterImageStyle: {
    zIndex: 2,
    height: 24,
    width: 24,
    marginTop: 4
  },

  toDoListWrapper: {
    flex: 2,
    position: 'relative'
  },

  filterImageWrapper: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
    backgroundColor: colorPalette.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
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