import React, { Component } from 'react';
import { View, Picker, Modal, TouchableHighlight, Text, Alert } from 'react-native';
import { Input, AddButton, Footer, Button, CloseButton } from '../Common';
import { Actions, ActionConst } from 'react-native-router-flux';
import { Calendar } from 'react-native-calendars';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { colorPalette, layouts } from '../../Style';

class ToDoModal extends Component {
  state = {
    id: this.props.modalValue.id,
    task: this.props.modalValue.task,
    appointee: this.props.modalValue.appointee,
    done: this.props.modalValue.done
    // selectedDate: '',
    // isCalanderVisible: false
  };

  componentDidUpdate(prevProps) {
    const {id, task, appointee, done} = this.props.modalValue;

    if (id !== prevProps.modalValue.id || done !== prevProps.modalValue.done) {
      this.setState({
        id,
        done,
        task,
        appointee
      });
    }
  }

  onSaveButtonPress = () => {
    const {id, done, task, appointee} = this.state;

    if (this.state.task.length === 0) {
      Alert.alert("That does not seem like a ToDo ;)");
      return;
    }

    this.props.updateToDo(id, done, task, appointee);
  }

  // onDateButtonPress = () => {
  //   this.setState({
  //     isCalanderVisible: true
  //   });
  // }

  getPickerItems = () => {
    return this.props.homeContext.users.map(user => {
      if (user.id !== this.props.homeContext.currentUser.id) {
        return (
          <Picker.Item label={user.name} value={user.id} />
        );
      }
    });
  }

  // getCalander = () => {
  //   const selectedDate = this.state.selectedDate;
  //   const mark = { [selectedDate]: { selected: true, marked: true, selectedColor: '#a9eec2' } };

  //   if (this.state.isCalanderVisible) {
  //     return (
  //       <Calendar
  //         onDayPress={(day) => this.setState({ selectedDate: day.dateString })}
  //         markedDates={mark}
  //         theme={{
  //           textSectionTitleColor: '#b6c1cd',
  //           selectedDayBackgroundColor: '#a9eec2',
  //           todayTextColor: '#a9eec2',
  //           arrowColor: '#a9eec2',
  //         }}
  //       />
  //     );
  //   }

  //   return (
  //     <Button onPress={this.onDateButtonPress} additionalButtonStyles={styles.additionalDateButtonStyle}>
  //       Add a due date
  //     </Button>
  //   );
  // }

  render() {
    const pickerItems = this.getPickerItems();

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.toDoContainer}>
            <CloseButton onPress={this.props.onModalClose} />
            <View style={styles.inputWrapper}>
              <View style={styles.namingWrapper}>
                <Input
                  value={this.state.task}
                  onChangeText={value => this.setState({ task: value })}
                  placeholder={'Enter a new to-do'}
                  additionalInputStyles={styles.additionalInputStyles}
                  autoFocus={true}
                />
              </View>
              <Picker
                selectedValue={this.state.appointee}
                onValueChange={value => this.setState({ appointee: value })}
                style={{ height: 120, backgroundColor: 'white' }}
                itemStyle={{ height: 120 }}
              >
                <Picker.Item label='Me' value={this.props.homeContext.currentUser.id} />
                {pickerItems}
                <Picker.Item label='For everyone' value='00000000-0000-0000-0000-000000000000' />
              </Picker>
              <View style={layouts.centerWrapper}>
                <Button
                  onPress={() => this.onSaveButtonPress()}
                  additionalButtonStyles={styles.buttonStyle}
                >
                  Save
              </Button>
              </View>
              {/* <View style={layouts.centerWrapper}>
                {this.getCalander()}
              </View> */}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  toDoContainer: {
    margin: 30,
    marginTop: 110,
    marginBottom: 110,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
  },

  calanderWrapper: {
    flex: 0,
    alignItems: 'center'
  },

  additionalInputStyles: {
    flexGrow: 1
  },

  additionalDateButtonStyle: {
    marginTop: 20,
    width: 130,
    backgroundColor: 'white',
    color: '#05004e',
    borderColor: '#05004e'
  },

  buttonStyle: {
    backgroundColor: colorPalette.secondary,
    marginTop: 5
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
        {homeContext => <ToDoModal {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);