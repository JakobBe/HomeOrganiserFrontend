import React, { Component } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Footer, ListItem, AddButton } from '../Common';
import { fetchEvents, createNewEvent, updateEvent } from '../RailsClient';
import { UserContext } from '../contexts/UserContextHolder';
import { HomeContext } from '../contexts/HomeContextHolder';
import { colorPalette, layouts } from '../Style';
import { CalendarModal } from './CalendarModal';

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
    await fetchEvents(this.props.homeContext.currentUser.id).then((response) => response.json())
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
        createNewEvent(this.state.selectedDate, text, this.props.homeContext.currentUser.id, `${hour}:${minute}`);
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
    const currentUser = this.props.homeContext.currentUser
    const itemUser = currentUser.id === itemUserId ? this.props.homeContext.currentUser : homeUsers.filter(user => user.id === itemUserId)[0];
    const userColor = itemUser.color
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
        itemUserId={itemUser.id}
        currentUserId={this.props.homeContext.currentUser.id}
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
    let dots = [];
    const dotMarkers = this.props.homeContext.users.map(user => {
      return { key: user.name, color: user.color };
    });

    this.props.homeContext.users.map(user => {
      if (event.user_id === user.id) {
        if (dots.length === 0) {
          dots = dotMarkers.filter(marker => marker.key === user.name);
        }
        if (marks[event.date] && marks[event.date]['dots']) {
          marks[event.date]['dots'].map(dot => {
            if (dot['key'] !== user.name && marks[event.date]['dots'].length !== this.props.homeContext.users.length) {
              let newDot = dotMarkers.filter(marker => marker.key === user.name)[0];
              if (!dots.includes(newDot)) {
                dots.push(newDot)
              }
              if (!dots.includes(dot)) {
                dots.push(dot);
              }
            };
            if (marks[event.date]['dots'].length >= this.props.homeContext.users.length) {
              dots = marks[event.date]['dots']
            };
          })
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

    let marks = { [this.state.selectedDate]: { selected: true, marked: true, selectedColor: colorPalette.primary } }

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
            selectedDayBackgroundColor: colorPalette.primary,
            todayTextColor: colorPalette.primary,
            arrowColor: colorPalette.primary,
            width: '100%'
          }}
        />
        <View style={layouts.centerWrapper}>
          <AddButton onPress={() => this.setState({ modalPresented: true })}/>
        </View>
        {selectedDayEventsList}
        <CalendarModal 
          showModal={this.state.modalPresented} 
          saveInput={this.saveModalInput} 
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

  container: {
    marginTop: 5,
    flex: 1,
  },

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