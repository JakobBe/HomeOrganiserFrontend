import React, { Component } from 'react';
import { ListView, View, Picker } from 'react-native';
import { Input, CardSection, Button, Footer } from '../common';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars';
import { createToDo } from '../Client';
import { UserContext } from '../contexts/UserContextHolder';
import { HomeContext } from '../contexts/HomeContextHolder';

class ToDoCreate extends Component {
  state = { newToDo: '', appointee: undefined , selectedDate: ''};

  onButtonPress = () => {
    if (this.state.newToDo.length > 0) {
      this.setState(({
        newToDo: ''
      }));

      createToDo(this.state.newToDo, (this.state.appointee || this.props.userContext.user.id), this.state.selectedDate, this.props.userContext.user.id);
      Actions.toDoList({ type: ActionConst.REPLACE });
    };
  }

  getPickerItems = () => {
    return this.props.homeContext.users.map(user =>  {
      if (user.id !== this.props.userContext.user.id) {
        return (
          <Picker.Item label={user.name} value={user.id} />
        );
      }
    });
  }

  render() {
    const pickerItems = this.getPickerItems();
    const selectedDate = this.state.selectedDate
    const mark = { [selectedDate]: { selected: true, marked: true, selectedColor: '#a9eec2' }}
    return (
      <View style={styles.toDoContainer}>
        <Input
          value={this.state.newToDo}
          onChangeText={value => this.setState({ newToDo: value })}
          placeholder={'Enter a new to-do'}
          autoFocus={true}
        />
        <Picker
          selectedValue={this.state.appointee}
          onValueChange={value => this.setState({ appointee: value })}
          style={{ height: 120, backgroundColor: 'white' }}
          itemStyle={{ height: 120 }}
        >
          <Picker.Item label='Me' value={this.props.userContext.user.id} />
          {pickerItems}
          <Picker.Item label='For everyone' value='all' />
        </Picker>
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
        <Button onPress={this.onButtonPress} additionalButtonStyles={styles.buttonStyle}>
          Add
        </Button>
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

  buttonStyle: {
    backgroundColor: '#05004e'
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