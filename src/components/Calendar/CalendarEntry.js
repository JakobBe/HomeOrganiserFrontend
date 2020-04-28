import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Animated, Text } from 'react-native';
import { Calendar, CalendarList } from 'react-native-calendars';
import { Footer, ListItem, AddButton } from '../Common';
// import { fetchEvents, createNewEvent, updateEvent } from '../../RailsClient';
import { createEvent, deleteEvent, updateEvent } from '../../graphql/Events/mutations';
// import {  } from '../../graphql/Events/queris';
import { appSyncGraphQl } from '../../AWSClient';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { colorPalette, layouts, deviceHeight } from '../../Style';
import { CalendarModal } from './CalendarModal';
import currentDate from '../../Helpers/currentDate';
import getDayMarkerDots from '../../Helpers/eventDotMarkers';
import moment from 'moment';
import GestureRecognizer from 'react-native-swipe-gestures';

class CalendarEntry extends Component {
  state = { 
    selectedDate: undefined, 
    events: [], 
    modalPresented: false, 
    refreshing: false,
    modalValue: undefined,
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
  }

  componentDidMount() {
    this.setState({
      events: this.props.homeContext.events,
      selectedDate: currentDate()
    });
  }

  animateContainers = (eventCount, swipeUp) => {
    console.log('Are you animating?', eventCount, swipeUp);
    if (!swipeUp) {
      let toValue = (deviceHeight - 250);
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

  // componentWillMount() {
  //   this.setState({
  //     events: this.props.homeContext.events,
  //     selectedDate: currentDate()
  //   });
  // }

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

  updateEvent = (id, text, allDay, time) => {
    const variables = {
      input: {
        id,
        date: this.state.selectedDate,
        text,
        allDay,
        time,
        userId: this.props.homeContext.currentUser.id,
        homeId: this.props.homeContext.id,
        updatedAt: moment.utc().format('YYYY-MM-DD')
      }
    };

    appSyncGraphQl(updateEvent, variables)
      .then((res) => {
        if (res.status === 200) {
          this.fetchEvents();
        }
      })
    this.setState({
      modalPresented: false
    }); 
  }

  createEvent = (text, allDay, time) => {
    const variables = {
      input: {
        date: this.state.selectedDate,
        text,
        allDay,
        time,
        userId: this.props.homeContext.currentUser.id,
        homeId: this.props.homeContext.id,
        createdAt: moment.utc().format('YYYY-MM-DD'),
        updatedAt: moment.utc().format('YYYY-MM-DD')
      }
    };

    appSyncGraphQl(createEvent, variables)
      .then((res) => {
        if (res.status === 200) {
          this.fetchEvents();
        }
      })
    this.setState({
      modalPresented: false
    });  
  }

  deleteEvent = (id) => {
    const variables = {
      input: {
        id
      }
    };

    appSyncGraphQl(deleteEvent, variables)
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

  onItemPressed = (item) => {
    this.setState({
      modalPresented: true,
      modalValue: item,
      singleEventId: item.id
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
        onItemPressed={this.onItemPressed}
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
    if (this.state.modalPresented) {
      this.setState({
        modalPresented: false,
        modalValue: undefined,
        singleEventId: undefined
      })
    }
  }

  onDayPress = (day) => {
    // if (day.dateString === selectedDate) {

    // }

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

    return (
      <View style={styles.calendarContainer}>
        <View>
          <Animated.View style={styles.calendarWrapper(this.calendarHeight)}>
            {this.getCalendarComponent()}
          </Animated.View>
          <Animated.View style={styles.eventContainer(this.eventContainerHeight)}>
            <GestureRecognizer
              onSwipeUp={(state) => this.onSwipeUp(state)}
              onSwipeDown={(state) => this.onSwipeDown(state)}
              config={config}
            >
              <View style={layouts.centerWrapper}>  
                <Text style={styles.dateHeader}>
                  {this.state.selectedDate}
                </Text>
              </View>
            </GestureRecognizer>
            {selectedDayEventsList}
            <View style={styles.addButtonStyle}>
              <AddButton onPress={() => this.setState({ modalPresented: true })}/>
            </View>
          </Animated.View>
          <CalendarModal 
            showModal={this.state.modalPresented} 
            saveInput={this.saveModalInput}
            createEvent={this.createEvent}
            updateEvent={this.updateEvent}
            onModalClose={this.onModalCose}
            modalValue={this.state.modalValue}
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

  eventContainer: (height) => ({
    height,
    width: '100%',
    backgroundColor: 'white',
    position: 'relative',
    borderTopColor: colorPalette.primary,
    borderTopWidth: 1,
    paddingTop: 10
  }),

  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'white',
  },

  addButtonStyle: {
    position: 'absolute',
    bottom: 2,
    right: 10
  },

  dateHeader: {
    fontWeight: 'bold'
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