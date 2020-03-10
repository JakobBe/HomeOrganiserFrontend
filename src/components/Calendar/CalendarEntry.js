import React, { Component } from 'react';
import { View, FlatList, RefreshControl, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
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
    isSwipedUp: false
  };

  constructor() {
    super();
    const marginTop = deviceHeight - (deviceHeight / 1.8)
    this.eventContainerHeight = new Animated.Value(marginTop);
  }

  animateEventContainer = () => {
    if (!this.state.isSwipedUp) {
      Animated.timing(
        this.eventContainerHeight,
        {
          toValue: 10,
          duration: 400
        }
      ).start();
      return;
    }

    if (this.state.isSwipedUp) {
      const marginTop = deviceHeight - (deviceHeight / 1.8)
      Animated.timing(
        this.eventContainerHeight,
        {
          toValue: marginTop,
          duration: 400
        }
      ).start();
    }
  }

  onSwipeUp(gestureState) {
    this.animateEventContainer();
    this.setState({ isSwipedUp: true });
  }

  onSwipeDown(gestureState) {
    if (this.state.isSwipedUp) {
      this.animateEventContainer();
      this.setState({ isSwipedUp: false });
    };
  }

  componentWillMount() {
    this.setState({
      events: this.props.homeContext.events,
      selectedDate: currentDate()
    });
  }

  fetchEvents = async () => {
    const events = await this.props.homeContext.updateEvents();
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

  render() {
    console.log('this.state.isSwipedUp', this.state.isSwipedUp);
    console.log('this.eventContainerHeight', this.eventContainerHeight);
    const selectedDayEventsList = this.getSelectedDayEventList();
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80
    };

    let marks = { [this.state.selectedDate]: { selected: true, marked: true, selectedColor: colorPalette.primary } }

    if (this.state.events.length > 0) {
      this.state.events.map(event => {
        marks[event.date] = { ...marks[event.date], dots: getDayMarkerDots(marks, event, this.props.homeContext.users), marked: true }
      })
    }
    return (
      <View style={styles.calendarContainer}>
        <Calendar 
          onDayPress={(day) => this.setState({ selectedDate: day.dateString })}
          markedDates={marks}
          markingType='multi-dot'
          theme={{
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: colorPalette.primary,
            todayTextColor: colorPalette.primary,
            arrowColor: colorPalette.primary,
            // width: '100%',
            // 'stylesheet.day.basic': {
            //   'base': {
            //     width: 30,
            //     height: 20
            //   }
            // }
          }}
        />
        <Animated.View style={styles.eventContainer(this.eventContainerHeight, this.state.isSwipedUp)}>
          <GestureRecognizer
            onSwipeUp={(state) => this.onSwipeUp(state)}
            onSwipeDown={(state) => this.onSwipeDown(state)}
            config={config}
          >
            <View style={[layouts.centerWrapper, {marginBottom: 10}]}>
              <AddButton onPress={() => this.setState({ modalPresented: true })}/>
            </View>
            <View style={layouts.centerWrapper}>
              <View style={{width: 40, borderWidth: 2, borderColor: 'rgb(200,200,200)', borderRadius: 10, marginTop: 10}}></View>
            </View>
          </GestureRecognizer>
          {selectedDayEventsList}
        </Animated.View>
        <CalendarModal 
          showModal={this.state.modalPresented} 
          saveInput={this.saveModalInput}
          createEvent={this.createEvent}
          updateEvent={this.updateEvent}
          onModalClose={this.onModalCose}
          modalValue={this.state.modalValue}
          singleEventId={this.state.singleEventId}
        />
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

  eventContainer: (height, isSwipedUp) => ({
    position: 'absolute',
    height: deviceHeight,
    marginTop: height,
    width: '100%',
    backgroundColor: 'white'
  }),

  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'white',
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