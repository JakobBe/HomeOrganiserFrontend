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

const RouterComponent = () => {
  return (
    <Router>
      <Scene key='root' >
        <Scene 
          key='entry' 
          component={Entry}
          title='Welcome'
          initial
          duration={0}
          leftTitle='Test'
          onLeft={() => Actions.calendar({ type: ActionConst.REPLACE })}
          rightTitle='Profile'
          onRight={() => Actions.profile({ type: ActionConst.REPLACE })}
          rightButtonTextStyle={{ color: '#a9eec2' }}
        />
        <Scene 
          key='toDoList' 
          component={ToDoList}
          title='ToDos'
          rightTitle='Add'
          onRight={() => Actions.toDoCreate({ type: ActionConst.REPLACE })}
          leftTitle='Home'
          onLeft={() => Actions.entry({ type: ActionConst.REPLACE })}
          duration={0}
          leftButtonTextStyle={{ color: '#a9eec2' }}
          rightButtonTextStyle={{ color: '#a9eec2' }}
          />
        <Scene
          key='toDoCreate'
          component={ToDoCreate}
          title='New ToDo'
          leftTitle='Back'
          onLeft={() => Actions.toDoList({ type: ActionConst.REPLACE })}
          duration={0}
          leftButtonTextStyle={{ color: '#a9eec2' }}
        />
        <Scene
          key='moneyBox'
          component={MoneyEntry}
          title='Money Box'
          leftTitle='Home'
          onLeft={() => Actions.entry({ type: ActionConst.REPLACE })}
          duration={0}
          leftButtonTextStyle={{ color: '#a9eec2' }}
        />
        <Scene
          key='calendar'
          component={CalendarEntry}
          title='Calendar'
          leftTitle='Home'
          onLeft={() => Actions.entry({ type: ActionConst.REPLACE })}
          duration={0}
          leftButtonTextStyle={{ color: '#a9eec2' }}
        />
        <Scene
          key='shoppingList'
          component={ShoppingList}
          title='Shopping List'
          leftTitle='Home'
          onLeft={() => Actions.entry({ type: ActionConst.REPLACE })}
          duration={0}
          leftButtonTextStyle={{ color: '#a9eec2' }}
        />
        <Scene
          key='profile'
          component={Profile}
          title='Profile'
          leftTitle='Home'
          onLeft={() => Actions.entry({ type: ActionConst.REPLACE })}
          duration={0}
          leftButtonTextStyle={{ color: '#a9eec2' }}
        />
      </Scene>
    </Router>
  );
}

export default RouterComponent;