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
import { filterMatrix } from '../../Helpers/filterMatrix';
import { getKeyByValue } from '../../Helpers/getKeyByValue';
import moment from 'moment';

class ToDoList extends Component {
  state = { 
    toDos: [], 
    refreshing: false, 
    filterModalPresented: false,
    filter: 1,
    filterOneValue: 'All ToDos',
    filterTwoValue: 'for me',
    toDoModalPresented: false,
    newToDo: '',
    modalValue: undefined
  };

  componentDidMount() {
    const toDos = this.filterUserRelevantToDos(this.props.homeContext.toDos, this.state.filter);
    this.setState({
      toDos
    });
  }

  filterUserRelevantToDos = (toDos, filter) => {
    let relevantToDos = [];
    const userToDos = toDos.filter(toDo => toDo.appointee === this.props.homeContext.currentUser.id);
    const everyoneToDos = toDos.filter(toDo => toDo.appointee === '00000000-0000-0000-0000-000000000000');
    const appointedToDos = toDos.filter(toDo => toDo.userId === this.props.homeContext.currentUser.id && toDo.appointee !== this.props.homeContext.currentUser.id);
    relevantToDos = [...new Set([userToDos, everyoneToDos, appointedToDos].flat())];

    switch (filter) {
      case 0:
        relevantToDos = relevantToDos;
        break;
      case 1:
        relevantToDos = userToDos;
        break;
      case 2: 
        relevantToDos = [userToDos, everyoneToDos].flat();
        break;
      case 3: 
        relevantToDos = appointedToDos;
        break;
      case 4:
        relevantToDos = relevantToDos.filter(toDo => !toDo.done);
        break;
      case 5:
        relevantToDos = userToDos.filter(toDo => !toDo.done);
        break;
      case 6:
        relevantToDos = [userToDos, everyoneToDos].flat().filter(toDo => !toDo.done);
        break;
      case 7:
        relevantToDos = appointedToDos.filter(toDo => !toDo.done);
        break;
      case 8:
        relevantToDos = relevantToDos.filter(toDo => toDo.done);
        break;
      case 9:
        relevantToDos = userToDos.filter(toDo => toDo.done);
        break;
      case 10:
        relevantToDos = [userToDos, everyoneToDos].flat().filter(toDo => toDo.done);
        break;
      case 11:
        relevantToDos = appointedToDos.filter(toDo => toDo.done);
        break;
    }
  
    return sortByCreatedAt(relevantToDos);
  }

  fetchToDos = async () => {
    let toDos = await this.props.homeContext.updateToDos();
    toDos = this.filterUserRelevantToDos(toDos, this.state.filter);

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

  onFilterValueOneChange = (filterOneValue) => {
    this.setState({
      filterOneValue
    });
  }

  onFilterValueTwoChange = (filterTwoValue) => {
    this.setState({
      filterTwoValue
    });
  }

  getFilterKeyFromValue = (value) => {
    let filterOneValue = undefined;
    let filterTwoValue = undefined;
    Object.keys(filterMatrix).map(topLevelKey => {
      const key = getKeyByValue(filterMatrix[topLevelKey], value);
      filterOneValue = key !== undefined ? topLevelKey : filterOneValue;
      filterTwoValue = key !== undefined ? key : filterTwoValue;
    })

    return { filterOneValue, filterTwoValue };
  }

  onFilterToDosPress = async (filterOneValue, filterTwoValue) => {
    this.onModalClose();
    const filter = filterMatrix[filterOneValue][filterTwoValue];
    const toDos = this.filterUserRelevantToDos(this.props.homeContext.toDos, filter);

    this.setState({
      filter,
      filterOneValue,
      filterTwoValue,
      toDos
    });
  };
  
  onModalClose = () => {
    if (this.state.filterModalPresented) {
      const { filterOneValue, filterTwoValue } = this.getFilterKeyFromValue(this.state.filter);
      this.setState({
        filterModalPresented: false,
        filterOneValue,
        filterTwoValue
      });
    };

    if (this.state.toDoModalPresented) {
      this.setState({
        toDoModalPresented: false
      });
    };
  };

  renderItem = ({ item }) => {
    const { currentUser, users } = this.props.homeContext;
    let forEveryone = false;
    let appointer = undefined;
    let userName = currentUser.name;
    let userColor = currentUser.color;

    if (item.appointee !== item.userId) {
      appointer = users.filter(user => user.id === item.userId)[0];
      if (item.appointee === '00000000-0000-0000-0000-000000000000') {
        forEveryone = true;
      } else if (appointer.id === currentUser.id) {
        const appointee = users.filter(user => user.id === item.appointee)[0];
        userName = appointee.name;
        userColor = appointee.color;
      }
    }
    
    return (
      <ListItem
        id={item.id}
        appointer={appointer}
        forEveryone={forEveryone}
        date={item.dueDate}
        text={item.task}
        refreshList={this._onRefresh}
        isToDo={true}
        userName={userName}
        done={item.done}
        userColor={userColor}
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
          filterOneValue={this.state.filterOneValue}
          filterTwoValue={this.state.filterTwoValue}
          onFilterValueOneChange={this.onFilterValueOneChange}
          onFilterValueTwoChange={this.onFilterValueTwoChange}
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