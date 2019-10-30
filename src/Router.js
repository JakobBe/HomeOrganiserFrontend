import React from 'react';
import { Navigator } from 'react-native';
import { Scene, Router, Actions, ActionConst } from 'react-native-router-flux';
import ToDoList from './ToDos/ToDoList';
import ToDoCreate from './ToDos/ToDoCreate';
import MoneyEntry from './MoneyBox/MoneyEntry';
import Entry from './FirstSteps/Entry';
import CalendarEntry from './Calendar/CalendarEntry';
import ShoppingList from './ShoppingCart/ShoppingList';
import Profile from './Profile';
import Arrival from './Arrival/Arrival';
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
          rightButtonImage={require('../assets/images/arrow-pointing-to-right.png')}
          onRight={() => Actions.toDoList({ type: ActionConst.REPLACE })}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.6 }}
          leftButtonImage={require('../assets/images/arrow-pointing-to-left.png')}
          onLeft={() => Actions.calendar({ type: ActionConst.REPLACE })}
          leftButtonStyle={{ position: 'absolute', left: -deviceWidth / 1.6 }}
        />
        <Scene 
          key='toDoList' 
          component={ToDoList}
          title='ToDos'
          duration={0}
          rightButtonImage={require('../assets/images/arrow-pointing-to-right.png')}
          onRight={() => Actions.shoppingList({ type: ActionConst.REPLACE })}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.6 }}
          leftButtonImage={require('../assets/images/arrow-pointing-to-left.png')}
          onLeft={() => Actions.entry({ type: ActionConst.REPLACE })}
          leftButtonStyle={{ position: 'absolute', left: -deviceWidth / 1.6 }}
          />
        <Scene
          key='moneyBox'
          component={MoneyEntry}
          duration={0}
          hideNavBar={true}
        />
        <Scene
          key='calendar'
          component={CalendarEntry}
          title='Calendar'
          duration={0}
          rightButtonImage={require('../assets/images/arrow-pointing-to-right.png')}
          onRight={() => Actions.entry({ type: ActionConst.REPLACE })}
          rightButtonStyle={{ position: 'absolute', right: -deviceWidth / 1.6 }}
          leftButtonImage={require('../assets/images/arrow-pointing-to-left.png')}
          onLeft={() => Actions.moneyBox({ type: ActionConst.REPLACE })}
          leftButtonStyle={{ position: 'absolute', left: -deviceWidth / 1.6 }}
        />
        <Scene
          key='shoppingList'
          component={ShoppingList}
          title='Shopping List'
          duration={0}
          leftButtonImage={require('../assets/images/arrow-pointing-to-left.png')}
          onLeft={() => Actions.toDoList({ type: ActionConst.REPLACE })}
          leftButtonStyle={{ position: 'absolute', left: -deviceWidth / 1.6 }}
        />
        <Scene
          key='profile'
          component={Profile}
          title='Profile'
          back={true}
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