import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { fetchHomes } from '../RailsClient';
import { HomeContext } from '../contexts/HomeContextHolder';
import { UserContext } from '../contexts/UserContextHolder';
import HomeSelectorModal from './HomeSelectorModal';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette } from '../Style/Colors';

class HomeSelector extends Component {
  state = {
    homes: undefined,
    createModalPresented: false,
    joinModalPresented: false
  }

  componentDidMount() {
    fetchHomes().then((response) => response.json())
      .then((res) => {
        this.setState({
          homes: res
        });
      })
  }

  onModalClose = () => {
    this.setState({
      createModalPresented: false,
      joinModalPresented: false
    })
  }

  onCreateHomePress = () => {
    this.setState({
      createModalPresented: true,
    })
  }

  onJoinHomePress = () => {
    this.setState({
      joinModalPresented: true,
    })
  }

  successfulHomeSelection = async (user) => {
    await this.props.homeContext.updateCurrentUser(user);
    Actions.entry({ type: ActionConst.REPLACE })
  }

  render() {
    return (
      <View style={styles.homeSelectorContainer}>
        <View style={styles.textWrapper}>
          <Text style={styles.mainText}>
            Hello {this.props.homeContext.currentUser.name} & welcome to EggPlanner. {"\n"}
            <Text style={styles.mainTextBody}>
              In order to get started you have to create a new Home or join an existing one.
            </Text>
          </Text>
        </View>
        <View style={styles.guideWrapper}>
          <TouchableOpacity style={styles.imageWrapper} onPress={this.onCreateHomePress}>
            <Image source={require('../../assets/images/eggplant_single.png')} style={styles.imageStyle}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imageWrapper} onPress={this.onJoinHomePress}>
            <Image source={require('../../assets/images/eggplant_double.png')} style={styles.imageStyle} />
          </TouchableOpacity>
        </View>
        <HomeSelectorModal 
          createModalPresented={this.state.createModalPresented}
          joinModalPresented={this.state.joinModalPresented}
          onModalClose={this.onModalClose}
          homes={this.state.homes}
          user={this.props.homeContext.currentUser}
          successfulHomeSelection={this.successfulHomeSelection}
        />
      </View>
    );
  }
}

const styles = {
  homeSelectorContainer: {
    padding: 30,
  },

  textWrapper: {
  },

  mainText: {
    fontSize: 20,
    color: colorPalette.secondary,
    lineHeight: 35,
    letterSpacing: 3
  },

  mainTextBody: {
    fontSize: 18,
    letterSpacing: 1
  },

  guideWrapper: {
    marginTop: 40,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  imageWrapper: {
    flex: 0,
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: colorPalette.secondary,
  },

  imageStyle: {
    height: 80,
    width: 80
  }
}

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <HomeSelector {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);
