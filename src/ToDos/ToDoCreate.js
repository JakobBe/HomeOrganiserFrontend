import React, { Component } from 'react';
import { ListView, View, Picker } from 'react-native';
import { Input, CardSection, Button, Footer } from '../common';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars';
import { createToDo } from '../Client';
import { UserContext } from '../contexts/UserContextHolder';

class ToDoCreate extends Component {
  state = { newToDo: '', appointee: '' , selectedDate: ''};

  onButtonPress = () => {
    if (this.state.newToDo.length > 0) {
      this.setState(({
        newToDo: ''
      }));

      createToDo(this.state.newToDo, this.state.appointee, this.state.selectedDate, this.props.userContext.user.id);
      Actions.toDoList({ type: ActionConst.REPLACE });
    };
  }

  render() {
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
          <Picker.Item label='-' value='-' />
          <Picker.Item label='Jakobi' value='Jakob' />
          <Picker.Item label='Fransi' value='Fransi' />
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
    {userContext => <ToDoCreate {...props} userContext={userContext} />}
  </UserContext.Consumer>
);