import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Animated, Text, Alert } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import { Footer, ListItem, AddButton } from '../Common';
import { createEvent, deleteEvent, updateEvent } from '../../graphql/Events/mutations';
import { appSyncGraphQl } from '../../AWSClient';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { colorPalette, layouts, deviceHeight } from '../../Style';
import { CalendarModal } from './CalendarModal';
import currentDate from '../../Helpers/currentDate';
import getDayMarkerDots from '../../Helpers/eventDotMarkers';
import moment from 'moment';
import GestureRecognizer from 'react-native-swipe-gestures';
import { valueFormatter } from '../../Helpers/valueFormatter';

class CalendarEntry extends Component {
  state = { 
    selectedDate: undefined, 
    events: [], 
    calendarModalPresented: false, 
    refreshing: false,
    calendarModalValues: {},
    singleEventId: undefined,
    isSwipedUp: false,
    isCalendarListActive: true,
    prevMonthsVisible: []
  };

  constructor() {
    super();
    const calendarHeight = (deviceHeight - 220);
    const eventHeight = (40);
    this.calendarHeight = new Animated.Value(calendarHeight);
    this.eventContainerHeight = new Animated.Value(eventHeight);
    this.eventContainerBackgroundColor = new Animated.Value(1);
  }

  componentDidMount() {
    const hour = moment.utc().format('HH');
    const minute = moment.utc().format('MM');

    let calendarModalValues = {
      date: currentDate(),
      eventText: '',
      isExistingEvent: false,
      onAllDayToggle: this.onAllDayToggle,
      onEventTextChange: this.onEventTextChange,
      onTimeChange: this.onTimeChange,
      time: `${hour}:${minute}`
    };

    this.setState({
      events: this.props.homeContext.events,
      selectedDate: currentDate(),
      calendarModalValues
    });
  }

  animateContainers = (eventCount, swipeUp) => {
    if (!swipeUp) {
      let toValue = (deviceHeight - 220);
      Animated.timing(
        this.calendarHeight,
        {
          toValue, 
          duration: 400
        }
      ).start();
      toValue = 40;
      Animated.timing(
        this.eventContainerHeight,
        {
          toValue,
          duration: 400
        }
      ).start();
      toValue = 1;
      Animated.timing(
        this.eventContainerBackgroundColor,
        {
          toValue,
          duration: 400
        }
      ).start();
      return;
    }

    if (eventCount > 0 && swipeUp) {
      let toValue = (deviceHeight / 2.5);
      Animated.timing(
        this.calendarHeight,
        {
          toValue,
          duration: 400
        }
      ).start();
      toValue = deviceHeight / 2.5;
      Animated.timing(
        this.eventContainerHeight,
        {
          toValue,
          duration: 400
        }
      ).start();
      toValue = 2;
      Animated.timing(
        this.eventContainerBackgroundColor,
        {
          toValue,
          duration: 400
        }
      ).start();
    }
  }

  onSwipeUp(gestureState) {
    this.animateContainers(2, true);
    this.setState({ isSwipedUp: true });
  }

  onSwipeDown(gestureState) {
    this.animateContainers(undefined, false);
    this.setState({ isSwipedUp: false });
  }

  fetchEvents = async () => {
    const events = await this.props.homeContext.updateEvents();
    let selectedDateEvents = events.filter(event => {
      return event.date === this.state.selectedDate;
    });

    if (selectedDateEvents.length === 0 && this.state.isSwipedUp) {
      this.setState({ isSwipedUp: false });
      this.animateContainers(selectedDateEvents.length, false);
    }

    if (selectedDateEvents.length > 0 && !this.state.isSwipedUp) {
      this.setState({
        isSwipedUp: true,
        isCalendarListActive: false
      });
      this.animateContainers(selectedDateEvents.length, true);
    }
    this.setState({
      events
    });
  }

  updateEvent = (id) => {
    const { eventText, allDay, time, userId } = this.state.calendarModalValues;
    if (userId !== this.props.homeContext.currentUser.id) {
      Alert.alert("This is not your Event, are you sure you want to update it?", '', [
        { text: 'Cancle', onPress: () => {return}, style: 'cancel' },
        { text: 'Yes', onPress: () => {
          const variables = {
            input: {
              id,
              date: this.state.selectedDate,
              text: eventText,
              allDay,
              time,
              userId,
              homeId: this.props.homeContext.id,
              updatedAt: moment.utc().format('YYYY-MM-DD')
            }
          };
      
          appSyncGraphQl({query: updateEvent, variables: variables})
            .then((res) => {
              if (res.status === 200) {
                this.fetchEvents();
              }
            })
          this.setState({
            calendarModalPresented: false
          });
        }}
      ]);
    }
    const variables = {
      input: {
        id,
        date: this.state.selectedDate,
        text: eventText,
        allDay,
        time,
        userId,
        homeId: this.props.homeContext.id,
        updatedAt: moment.utc().format('YYYY-MM-DD')
      }
    };

    appSyncGraphQl({query: updateEvent, variables})
      .then((res) => {
        if (res.status === 200) {
          this.fetchEvents();
        }
      })
    this.setState({
      calendarModalPresented: false
    });
  }

  createEvent = () => {
    const { eventText, allDay, time } = this.state.calendarModalValues;
    const variables = {
      input: {
        date: this.state.selectedDate,
        text: eventText,
        allDay,
        time,
        userId: this.props.homeContext.currentUser.id,
        homeId: this.props.homeContext.id,
        createdAt: moment.utc().format('YYYY-MM-DD'),
        updatedAt: moment.utc().format('YYYY-MM-DD')
      }
    };

    appSyncGraphQl({query: createEvent, variables})
      .then((res) => {
        if (res.status === 200) {
          this.fetchEvents();
        }
      })
    this.setState({
      calendarModalPresented: false
    });  
  }

  deleteEvent = (id) => {
    const variables = {
      input: {
        id
      }
    };

    appSyncGraphQl({query: deleteEvent, variables})
      .then((res) => {
        if (res.status === 200) {
          this.fetchEvents();
        }
      });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchEvents().then(() => {
      this.setState({ refreshing: false });
    });
  }

  onTimeChange = (value) => {
    let calendarModalValues = this.state.calendarModalValues;
    calendarModalValues['time'] = value;

    this.setState({
      calendarModalValues
    });
  }

  onAllDayToggle = (value) => {
    let calendarModalValues = this.state.calendarModalValues;
    calendarModalValues['allDay'] = value;

    this.setState({
      calendarModalValues
    });
  }

  onEventTextChange = (value) => {
    let calendarModalValues = this.state.calendarModalValues;
    calendarModalValues['eventText'] = value;

    this.setState({
      calendarModalValues
    });
  }

  onModalOpen = (id) => {

    const event = this.state.events.find(event => event.id === id);
    const hour = moment.utc().format('HH');
    const minute = moment.utc().format('MM');

    let calendarModalValues = {
      date: this.state.selectedDate,
      eventText: '',
      eventId: undefined,
      onAllDayToggle: this.onAllDayToggle,
      onEventTextChange: this.onEventTextChange,
      onTimeChange: this.onTimeChange,
      time: `${hour}:${minute}`,
      allDay: false
    };

    if (event) {
      calendarModalValues['eventText'] = event.text
      calendarModalValues['allDay'] = event.allDay
      calendarModalValues['time'] = event.time
      calendarModalValues['eventId'] = event.id
      calendarModalValues['userId'] = event.userId
    } 

    this.setState({
      calendarModalPresented: true,
      calendarModalValues
    });
  }

  renderItem = ({ item }) => {
    const { currentUser, users } = this.props.homeContext;
    const itemUserId = item.userId;
    const itemUser = currentUser.id === itemUserId ? currentUser : users.filter(user => user.id === itemUserId)[0];
    const userColor = itemUser.color;
    const time = item.allDay ? 'All Day' : item.time;

    return (
      <ListItem
        userName={itemUser.name}
        id={item.id}
        text={item.text}
        refreshList={this._onRefresh}
        userColor={userColor}
        onItemPressed={this.onModalOpen}
        description={time}
        isCalendarEntry={true}
        itemUserId={itemUser.id}
        currentUserId={currentUser.id}
        deleteItem={this.deleteEvent}
        item={item}
      />
    )
  }

  onModalCose = () => {
    if (this.state.calendarModalPresented) {
      this.setState({
        calendarModalPresented: false,
        calendarModalValues: {},
      })
    }
  }

  onDayPress = (day) => {
    this.setState({ selectedDate: day.dateString });
    let selectedDateEvents = this.state.events.filter(event => {
      return event.date === day.dateString
    });

    if (selectedDateEvents.length === 0 && this.state.isSwipedUp) {
      this.setState({ isSwipedUp: false });
      this.animateContainers(selectedDateEvents.length, false);
    }

    if (selectedDateEvents.length > 0 && !this.state.isSwipedUp) {
      this.setState({ 
        isSwipedUp: true,
      });
      this.animateContainers(selectedDateEvents.length, true);
    }
  }

  getSelectedDayEvents = () => {
    let selectedDateEvents = this.state.events.filter(event => {
      return event.date === this.state.selectedDate
    });
    return selectedDateEvents;
  }

  getSelectedDayEventList = () => {
    const selectedDayEvents = this.getSelectedDayEvents()
    const extractKey = ({ id }) => id
    return (
      <FlatList
        style={styles.flatList}
        data={selectedDayEvents}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      />
    );
  }

  onVisibleMonthsChange = (months, isCalendarListActive) => {
    if (isCalendarListActive) {
      this.setState({
        isCalendarListActive: false
      });
      return
    }

    if (this.state.isSwipedUp && months.length > 1) {
      this.setState({
        isSwipedUp: false,
        isCalendarListActive: true,
      });
      this.animateContainers(undefined, false);
    }
  }

  getCalendarComponent = () => {
    let marks = { [this.state.selectedDate]: { selected: true, marked: true, selectedColor: colorPalette.primary } }

    if (this.state.events.length > 0) {
      this.state.events.map(event => {
        marks[event.date] = { ...marks[event.date], dots: getDayMarkerDots(marks, event, this.props.homeContext.users), marked: true }
      })
    }

    if (!this.state.isSwipedUp) {    
      return (
        <CalendarList
          pastScrollRange={12}
          futureScrollRange={36}
          scrollEnabled={true}
          showScrollIndicator={true}
          onDayPress={(day) => this.onDayPress(day)}
          markedDates={marks}
          current={this.state.selectedDate}
          markingType='multi-dot'
          theme={{
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: colorPalette.primary,
            todayTextColor: colorPalette.primary,
            arrowColor: colorPalette.primary,
          }}
        />
      );
    }
    return (
      <CalendarList
        pastScrollRange={12}
        futureScrollRange={36}
        scrollEnabled={true}
        showScrollIndicator={true}
        onVisibleMonthsChange={(months) => this.onVisibleMonthsChange(months, this.state.isCalendarListActive)}
        onDayPress={(day) => this.onDayPress(day)}
        markedDates={marks}
        current={this.state.selectedDate}
        markingType='multi-dot'
        theme={{
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: colorPalette.primary,
          todayTextColor: colorPalette.primary,
          arrowColor: colorPalette.primary,
        }}
      />
    );
  }

  render() {
    const selectedDayEventsList = this.getSelectedDayEventList();
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };
    const interpolateColor = this.eventContainerBackgroundColor.interpolate({
      inputRange: [1, 2],
      outputRange: [colorPalette.primary, 'white']
    });

    return (
      <View style={styles.calendarContainer}>
        <View>
          <Animated.View style={styles.calendarWrapper(this.calendarHeight)}>
            {this.getCalendarComponent()}
          </Animated.View>
          <Animated.View style={styles.eventContainer(this.eventContainerHeight, interpolateColor)}>
            <GestureRecognizer
              onSwipeUp={(state) => this.onSwipeUp(state)}
              onSwipeDown={(state) => this.onSwipeDown(state)}
              config={config}
            >
              <View style={layouts.centerWrapper}> 
                <Animated.View style={styles.swipUpIndicator(interpolateColor)}></Animated.View>
                <Text style={styles.dateHeader} onPress={(state) => this.onSwipeUp(state)}>
                  {valueFormatter(this.state.selectedDate, 'day')}
                </Text>
              </View>
            </GestureRecognizer>
            {selectedDayEventsList}
            <View style={styles.addButtonStyle}>
              <AddButton onPress={this.onModalOpen}/>
            </View>
          </Animated.View>
          <CalendarModal 
            showModal={this.state.calendarModalPresented} 
            saveInput={this.saveModalInput}
            createEvent={this.createEvent}
            updateEvent={this.updateEvent}
            onModalClose={this.onModalCose}
            calendarModalValues={this.state.calendarModalValues}
            singleEventId={this.state.singleEventId}
            day={this.state.selectedDate}
          />
        </View>
        <Footer isCalendarActive={true}/>
      </View>  
    );
  }
}

const styles = {
  calendarContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgb(255,255,255)',
  },

  flatList: {
    marginTop: 5,
    flex: 1
  },

  calendarWrapper: (height) => ({
    height,
    width: '100%',
  }),

  eventContainer: (height, backgroundColor) => ({
    height,
    width: '100%',
    backgroundColor: 'white',
    position: 'relative',
    borderTopColor: colorPalette.secondary,
    borderTopWidth: 1,
  }),

  swipUpIndicator: (backgroundColor) => ({
    width: 20, height: 2.5, backgroundColor, borderRadius: 2, margin: 5
  }),

  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'white',
  },

  addButtonStyle: {
    position: 'absolute',
    bottom: -4,
    right: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },

  dateHeader: {
    fontWeight: 'bold',
    fontSize: 20
  }
};

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <CalendarEntry {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);