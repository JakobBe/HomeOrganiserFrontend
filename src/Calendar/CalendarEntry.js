import React, { Component } from 'react';
import { TextInput, Text, View, FlatList, RefreshControl } from 'react-native';
import { Calendar, CalendarList, Agenda, Arrow } from 'react-native-calendars';
import { Footer, CommonModal, Button, ListItem } from '../common';
import { fetchEvents, createNewEvent, updateEvent } from '../Client';
import { UserContext } from '../contexts/UserContextHolder';
import { HomeContext } from '../contexts/HomeContextHolder';

class CalendarEntry extends Component {
  state = { 
    selectedDate: undefined, 
    events: [], 
    modalPresented: false, 
    refreshing: false,
    modalValue: undefined,
    singleEventId: undefined
  };

  componentWillMount() {
    this.fetchEvents()
    this.setState({
      selectedDate: this.currentDate()
    });
  }

  currentDate = () => {
    let day = new Date().getDate();
    let month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    if (month.toString().length === 1) {
      month = `0${month}`
    }

    if (day.toString().length === 1) {
      day = `0${day}`
    }

    const today = `${year}-${month}-${day}`;
    return today
  }

  fetchEvents = async () => {
    await fetchEvents(this.props.userContext.user.id).then((response) => response.json())
      .then((res) => this.setState({
        events: res
      }));
  }

  saveModalInput = (text, hour, minute, id) => {
    if (text.length > 0) {
      if (id) {
        updateEvent(text, id);
      }
      if (!id) {
        createNewEvent(this.state.selectedDate, text, this.props.userContext.user.id, `${hour}:${minute}`);
      }
      this.setState({
        modalPresented: false
      });
      this.fetchEvents();
    }
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.fetchEvents().then(() => {
      this.setState({ refreshing: false });
    });
  }

  onItemPressed = (modalValue, id) => {
    this.setState({
      modalPresented: true,
      modalValue,
      singleEventId: id
    });
  }

  renderItem = ({ item }) => {
    const itemUserId = item.user_id
    const homeUsers = this.props.homeContext.users
    const itemUser = homeUsers.filter(user => user.id === itemUserId)
    const userColor = itemUser[0].color
    const time = item.time ? item.time.substr(11,5) : 'All Day'

    return (
      <ListItem
        userName={item.user_name}
        id={item.id}
        text={item.text}
        refreshList={this._onRefresh}
        userColor={userColor}
        onItemPressed={this.onItemPressed}
        description={time}
        isCalendarEntry={true}
        itemUserId={itemUser[0].id}
        currentUserId={this.props.userContext.user.id}
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

  getDayMarkerDots = (marks, event) => {
    let dots = undefined;
    const dotMarkers = this.props.homeContext.users.map(user => {
      return { key: user.name, color: user.color };
    });

    this.props.homeContext.users.map(user => {
      if (event.user_id === user.id) {
        if (marks[event.date] && marks[event.date]['dots']) {
          marks[event.date]['dots'].map(dot => {
            if (dot['key'] !== user.name && marks[event.date]['dots'].length === 1) {
              dots = dotMarkers;
            };
            if (marks[event.date]['dots'].length > 1) {
              dots = marks[event.date]['dots']
            };
          })
        }
        if (!dots) {
          dots = dotMarkers.filter(marker => marker.key === user.name);
        }
      };
    })
    return dots;
  }

  getSelectedDayEvents = () => {
    let selectedDateEvents = this.state.events.filter(event => {
      return event.date === this.state.selectedDate
    });
    return selectedDateEvents;
  }

  getSelectedDayEventList = () => {
    const rows = this.getSelectedDayEvents()
    const extractKey = ({ id }) => id
    return (
      <FlatList
        style={styles.container}
        data={rows}
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
    const selectedDayEventsList = this.getSelectedDayEventList()

    let marks = { [this.state.selectedDate]: { selected: true, marked: true, selectedColor: '#a9eec2' } }

    if (this.state.events.length > 0) {
      this.state.events.map(event => {
        marks[event.date] = { ...marks[event.date], dots: this.getDayMarkerDots(marks, event), marked: true }
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
            selectedDayBackgroundColor: '#a9eec2',
            todayTextColor: '#a9eec2',
            arrowColor: '#a9eec2',
          }}
        />
        <Button onPress={() => this.setState({ modalPresented: true })} additionalButtonStyles={styles.buttonStyle}>
          New Event
        </Button>
        {selectedDayEventsList}
        <CommonModal 
          showModal={this.state.modalPresented} 
          saveInput={this.saveModalInput} 
          onModalClose={this.onModalCose}
          modalValue={this.state.modalValue}
          singleEventId={this.state.singleEventId}
        />
        <Footer />
      </View>  
    );
  }
}

const styles = {
  calendarContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgb(255,255,255)'
  },
  container: {
    marginTop: 5,
    flex: 1,
  },
  row: {
    padding: 15,
    marginBottom: 5,
    backgroundColor: 'white',
  },
  buttonStyle: {
    backgroundColor: '#05004e',
    marginTop: 5
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