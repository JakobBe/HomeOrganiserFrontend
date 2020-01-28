import React, { Component } from 'react';
import { View, Picker } from 'react-native';
import { Input, Button, Footer } from '../Common';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Calendar } from 'react-native-calendars';
import { createToDo } from '../../RailsClient';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';

class ToDoCreate extends Component {
  state = { 
    newToDo: '', 
    appointee: undefined , 
    selectedDate: '',
    isCalanderVisible: false
  };

  onButtonPress = () => {
    if (this.state.newToDo.length > 0) {
      this.setState(({
        newToDo: ''
      }));

      createToDo(this.state.newToDo, (this.state.appointee || this.props.homeContext.currentUser.id), this.state.selectedDate, this.props.homeContext.currentUser.id);
      Actions.toDoList({ type: ActionConst.REPLACE });
    };
  }

  onDateButtonPress = () => {
    this.setState({
      isCalanderVisible: true
    });
  }

  getPickerItems = () => {
    return this.props.homeContext.users.map(user =>  {
      if (user.id !== this.props.homeContext.currentUser.id) {
        return (
          <Picker.Item label={user.name} value={user.id} />
        );
      }
    });
  }

  getCalander = () => {
    const selectedDate = this.state.selectedDate;
    const mark = { [selectedDate]: { selected: true, marked: true, selectedColor: '#a9eec2' } };

    if (this.state.isCalanderVisible) {
      return (
        <Calendar
          onDayPress={(day) => this.setState({ selectedDate: day.dateString })}
          markedDates={mark}
          theme={{
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#a9eec2',
            todayTextColor: '#a9eec2',
            arrowColor: '#a9eec2',
          }}
        />
      );
    }

    return (
      <Button onPress={this.onDateButtonPress} additionalButtonStyles={styles.additionalDateButtonStyle}>
        Add a due date
      </Button>
    );
  }

  render() {
    const pickerItems = this.getPickerItems();
    
    return (
      <View style={styles.toDoContainer}>
        <View style={styles.inputWrapper}>
          <View style={styles.namingWrapper}>
            <Input
              value={this.state.newToDo}
              onChangeText={value => this.setState({ newToDo: value })}
              placeholder={'Enter a new to-do'}
              additionalInputStyles={styles.additionalInputStyles}
              autoFocus={true}
            />
            <Button onPress={this.onButtonPress} additionalButtonStyles={styles.additionalButtonStyle}>
              +
            </Button>
          </View>
          <Picker
            selectedValue={this.state.appointee}
            onValueChange={value => this.setState({ appointee: value })}
            style={{ height: 120, backgroundColor: 'white' }}
            itemStyle={{ height: 120 }}
          >
            <Picker.Item label='Me' value={this.props.homeContext.currentUser.id} />
            {pickerItems}
            <Picker.Item label='For everyone' value='all' />
          </Picker>
          {this.getCalander()}
        </View>
        <Footer />
      </View>
    );
  }
};

const styles = {
  toDoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },

  additionalInputStyles: {
    flexGrow: 1
  },

  additionalButtonStyle: {
    backgroundColor: '#05004e',
    marginTop: 5,
    height: 40,
    width: 40,
    borderRadius: 20
  },

  additionalDateButtonStyle: {
    marginTop: 20,
    width: 130,
    backgroundColor: 'white',
    color: '#05004e',
    borderColor: '#05004e'
  },

  namingWrapper: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
    padding: 5,
  },

  inputWrapper: {
    flex: 0,
    // alignItems: 'center'
  }
}

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <ToDoCreate {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);