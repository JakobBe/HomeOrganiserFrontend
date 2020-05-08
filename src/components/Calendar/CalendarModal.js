import React, { Component } from 'react';
import { Modal, Text, TouchableOpacity, View, Picker, Switch, Keyboard, Animated } from 'react-native';
import { Button, Input, TouchableTextHighlight, CloseButton } from '../Common';
import { colorPalette, layouts } from '../../Style';
import moment from 'moment';
import { valueFormatter } from '../../Helpers/valueFormatter';

class CalendarModal extends Component {
  state = {
    timeDetailsPresented: true,
    timePickerPresented: false,
  };

  constructor() {
    super();
    this.timePickerHeight = new Animated.Value(0);
  }

  onSaveButtonPress = (eventId) => {
    this.setState({
      timePickerPresented: false
    });

    if (eventId !== undefined) {
      this.props.updateEvent(eventId);
      return;
    }

    this.props.createEvent(); 
  }

  onAllDayToggle = (value) => {
    Keyboard.dismiss();
    this.props.calendarModalValues.onAllDayToggle(value);

    if (this.state.timePickerPresented) {
      this.onAnimation(this.state.timePickerPresented);
    }

    this.setState({
      allDay: value,
      timeDetailsPresented: !value,
      timePickerPresented: false
    });
  }

  onTimePressed = () => {
    Keyboard.dismiss();
    this.onAnimation(this.state.timePickerPresented);

    this.setState({
      timePickerPresented: !this.state.timePickerPresented
    });
  }

  onAnimation = (timePickerPresented) => {
    const toValue = timePickerPresented ? 0 : 150;
    Animated.timing(
      this.timePickerHeight,
      {
        toValue,
        duration: 400
      }
    ).start();
  }

  getHourPickerItems = () => {
    const hours = Array.from({ length: 24 }, (v, k) => (k).toString());

    return hours.map(hour => {
      let visibleHour = hour.length === 1 ? `0${hour}` : hour
      return (
        <Picker.Item label={visibleHour} value={visibleHour} style={{ color: colorPalette.secondary }} />
      );
    });
  }

  getMinutePickerItems = () => {
    const minutes = Array.from({ length: 60 }, (v, k) => (k).toString());

    return minutes.map(minute => {
      let visibleMinute = minute.length === 1 ? `0${minute}` : minute
      return (
        <Picker.Item label={visibleMinute} value={visibleMinute} style={{ color: colorPalette.secondary }} />
      );
    });
  }

  getTimePicker = (time, onTimeChange) => {
    if (time === undefined) {
      return;
    }

    const hourPickerItems = this.getHourPickerItems();
    const minutePickerItems = this.getMinutePickerItems();

    const hour = time.substring(0, 2);
    const minute = time.substring(3, 5);
    const height = this.state.timePickerPresented ? 200 : 0;
    return (
      <Animated.View style={styles.timePickerWrapper(this.timePickerHeight)}>
        <Picker
          selectedValue={hour}
          onValueChange={value => onTimeChange(`${value}:${minute}`)}
          style={{ height, backgroundColor: 'transparent', width: 80, color: colorPalette.secondary }}
          itemStyle={{ height }}
        >
          {hourPickerItems}
        </Picker>
        <Text style={{ fontSize: 30, color: colorPalette.secondary }}>:</Text>
        <Picker
          selectedValue={minute}
          onValueChange={value => onTimeChange(`${hour}:${value}`)}
          style={{ height, backgroundColor: 'transparent', width: 80, color: colorPalette.secondary }}
          itemStyle={{ height }}
        >
          {minutePickerItems}
        </Picker>
      </Animated.View>
    );
  }

  getTimeDetails = (time, allDay) => {
    return !allDay ? (
      <TouchableOpacity
        onPress={this.onTimePressed}
        underlayColor={'white'}
        style={styles.timeDetailsWrapper}
      >
        {/* <Text style={styles.allDayText}>
          Starting
        </Text> */}
        <Text style={styles.time}>
          {time}
        </Text>
    </TouchableOpacity>
    ) : undefined;
  }

  onModalClose = () => {
    this.timePickerHeight = new Animated.Value(0);
    this.setState({
      timePickerPresented: false
    });
    this.props.onModalClose();
  }

  render() {
    const { date, eventText, eventId, allDay, time, onEventTextChange, onTimeChange } = this.props.calendarModalValues;
    const timePicker = this.getTimePicker(time, onTimeChange);
    const timeDetails = this.getTimeDetails(time, allDay);

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.showModal}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.modalContainer}>
            <CloseButton onPress={this.onModalClose} />
            <View style={layouts.centerWrapper}>
              <Text style={styles.dateHeader}>
                {valueFormatter(date, 'day')}
              </Text>
            </View>
            <Input
              value={eventText}
              onChangeText={value => onEventTextChange(value)}
              placeholder={'Enter a new event'}
              autoFocus={true}
            />
            <View style={styles.timeInfoWrapper}>
              <View style={styles.allDayWrapper(allDay)}>
                <Text style={styles.allDayText}>
                  All-day
                </Text>
                <Switch
                  value={allDay}
                  onValueChange={(value) => this.onAllDayToggle(value)}
                />
              </View>
              {timeDetails}
            </View>
            {timePicker}
            <View style={layouts.centerWrapper}>
              <Button
                onPress={() => this.onSaveButtonPress(eventId)}
                additionalButtonStyles={styles.buttonStyle}
              >
                Save
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  modalContainer: {
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

  buttonStyle: {
    backgroundColor: colorPalette.secondary,
    marginTop: 5
  },

  timeInfoWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    marginTop: 20
  },

  timePickerWrapper: (height) => ({
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: 'white',
    height
  }),

  allDayWrapper: (allDay) =>  ({
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    borderRightColor: allDay ? 'none' : colorPalette.secondary,
    borderRightWidth: allDay ? 0 : 2,
    marginRight: 0,
    padding: 5,
    paddingRight: 10
  }),

  allDayText: {
    fontSize: 20,
    marginRight: 5
  },

  time: {
    fontSize: 20,
    color: 'white'
  },

  timeDetailsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colorPalette.primary,
    borderRadius: 20,
    padding: 5,
    margin: 10
  },

  dateHeader: {
    fontWeight: 'bold',
    fontSize: 20
  }
}

export { CalendarModal };