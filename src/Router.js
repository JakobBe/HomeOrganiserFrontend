import React from 'react';
import { Navigator } from 'react-native';
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux';
import ToDoList from './components/ToDos/ToDoList';
import MoneyEntry from './components/MoneyBox/MoneyEntry';
import Entry from './components/FirstSteps/Entry';
import CalendarEntry from './components/Calendar/CalendarEntry';
import ShoppingList from './components/ShoppingCart/ShoppingList';
import Profile from './Profile';
import Arrival from './components/Arrival/Arrival';
import { colorPalette, deviceWidth } from './Style';

const RouterComponent = () => {
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
          key='entry'
          component={Entry}
          title='Welcome Home'
          duration={0}
          rightButtonImage={require('../assets/images/user-black.png')}
          onRight={() => Actions.profile()}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.8 }}
        />
        <Scene 
          key='toDoList' 
          component={ToDoList}
          title='ToDos'
          duration={0}
          rightButtonImage={require('../assets/images/user-black.png')}
          onRight={() => Actions.profile()}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.8 }}
          />
        <Scene
          key='moneyBox'
          component={MoneyEntry}
          duration={0}
          // hideNavBar={true}
          rightButtonImage={require('../assets/images/user-black.png')}
          onRight={() => Actions.profile()}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.8 }}
          navigationBarStyle={{ backgroundColor: colorPalette.secondary }}
        />
        <Scene
          key='calendar'
          component={CalendarEntry}
          title='Calendar'
          duration={0}
          rightButtonImage={require('../assets/images/user-black.png')}
          onRight={() => Actions.profile()}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.8 }}
        />
        <Scene
          key='shoppingList'
          component={ShoppingList}
          title='Shopping List'
          duration={0}
          rightButtonImage={require('../assets/images/user-black.png')}
          onRight={() => Actions.profile()}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.8 }}
        />
        <Scene
          key='profile'
          component={Profile}
          title='Profile'
          leftButtonImage={require('../assets/images/arrow-pointing-to-left.png')}
          leftButtonStyle={{ position: 'absolute', left: -deviceWidth / 1.8 }}
          onLeft={() => Actions.pop()}
          // leftTitle='Back'
          // onLeft={() => Actions.entry({ type: ActionConst.REPLACE })}
          duration={0}
          // leftButtonTextStyle={{ color: colorPalette.secondary }}
        />
      </Scene>
    </Router>
  );
}

export default RouterComponent;