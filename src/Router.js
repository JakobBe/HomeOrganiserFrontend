import React from 'react';
import { Navigator, TouchableOpacity, Alert } from 'react-native';
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux';
import { HomeContext } from './contexts/HomeContextHolder';
import ToDoList from './components/ToDos/ToDoList';
import MoneyEntry from './components/MoneyBox/MoneyEntry';
import Entry from './components/FirstSteps/Entry';
import CalendarEntry from './components/Calendar/CalendarEntry';
import ShoppingList from './components/ShoppingCart/ShoppingList';
import Profile from './Profile';
import Arrival from './components/Arrival/Arrival';
import HomeSelector from './components/FirstSteps/HomeSelector';
import { colorPalette, deviceWidth } from './Style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowAltCircleLeft, faUserCircle, faPowerOff, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import NewProfile from './NewProfile';

const RouterComponent = () => {
  const logout = () => {
    Alert.alert("Are you sure you want to logout?", '', [
      { text: 'Cancle', onPress: () => console.log('cancle'), style: 'cancel' },
      { text: 'Yes', onPress: () => { Actions.arrival(); }}
    ]);
  }

  return (
    <Router>
      <Scene key='root' >
        <Scene 
          key='arrival' 
          component={Arrival}
          initial
          duration={0}
          hideNavBar={true}
        />
        <Scene
          key='homeSelector'
          component={HomeSelector}
          title='Select a Home'
          duration={0}
        />
        <Scene
          key='entry'
          component={Entry}
          title='Welcome Home'
          duration={0}
          renderRightButton={() =>
            <TouchableOpacity onPress={() => Actions.profile()}>
              <FontAwesomeIcon icon={faUserCircle} style={{ color: colorPalette.primary, marginRight: 15 }} size={30} />
            </TouchableOpacity>
          }
        />
        <Scene 
          key='toDoList' 
          component={ToDoList}
          title='ToDos'
          duration={0}
          renderRightButton={() =>
            <TouchableOpacity onPress={() => Actions.profile()}>
              <FontAwesomeIcon icon={faUserCircle} style={{ color: colorPalette.primary, marginRight: 15 }} size={30} />
            </TouchableOpacity>
          }
          />
        <Scene
          key='moneyBox'
          component={MoneyEntry}
          duration={0}
          // hideNavBar={true}
          renderRightButton={() =>
            <TouchableOpacity onPress={() => Actions.profile()}>
              <FontAwesomeIcon icon={faUserCircle} style={{ color: colorPalette.primary, marginRight: 15 }} size={30} />
            </TouchableOpacity>
          }
          navigationBarStyle={{ backgroundColor: colorPalette.secondary }}
        />
        <Scene
          key='calendar'
          component={CalendarEntry}
          title='Calendar'
          duration={0}
          renderRightButton={() =>
            <TouchableOpacity onPress={() => Actions.profile()}>
              <FontAwesomeIcon icon={faUserCircle} style={{ color: colorPalette.primary, marginRight: 15 }} size={30} />
            </TouchableOpacity>
          }
        />
        <Scene
          key='shoppingList'
          component={ShoppingList}
          title='Shopping List'
          duration={0}
          renderRightButton={() =>
            <TouchableOpacity onPress={() => Actions.profile()}>
              <FontAwesomeIcon icon={faUserCircle} style={{ color: colorPalette.primary, marginRight: 15 }} size={30} />
            </TouchableOpacity>
          }
          // rightButtonImage={require('../assets/images/user-black.png')}
          // onRight={() => Actions.profile()}
          // rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.8 }}
        />
        <Scene
          key='profile'
          component={Profile}
          title='Profile'
          renderLeftButton={() =>
            <TouchableOpacity onPress={() => Actions.pop()}>
              <FontAwesomeIcon icon={faArrowAltCircleLeft} style={{ color: colorPalette.primary, marginLeft: 15 }} size={25}/>
            </TouchableOpacity>
          }
          renderRightButton={() =>
            <TouchableOpacity onPress={() => logout()}>
              <FontAwesomeIcon icon={faPowerOff} style={{ color: colorPalette.primary, marginRight: 15 }} size={25} />
            </TouchableOpacity>
          }
          duration={0}
        />
        <Scene
          key='newProfile'
          component={NewProfile}
          title='Create Profile'
          renderRightButton={() =>
            <TouchableOpacity onPress={() => logout()}>
              <FontAwesomeIcon icon={faTimesCircle} style={{ color: colorPalette.primary, marginRight: 15 }} size={25} />
            </TouchableOpacity>
          }
          duration={0}
        />
      </Scene>
    </Router>
  );
}

export default RouterComponent;