import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { fetchHomes } from '../../RailsClient';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { UserContext } from '../../contexts/UserContextHolder';
import HomeSelectorModal from './HomeSelectorModal';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette } from '../../Style/Colors';
import { appSyncGraphQl } from '../../AWSClient';
import { createHome } from '../../graphql/Homes/mutations';
import { listHomes } from '../../graphql/Homes/queries';
import ProfileCompletionModal from './ProfileCompletionModal';

class HomeSelector extends Component {
  state = {
    homes: undefined,
    createModalPresented: false,
    joinModalPresented: false,
    profileCompletionModalPresented: false,
    homeId: undefined
  }

  componentDidMount() {
    appSyncGraphQl(listHomes)
      .then((res) => {
        console.log('res', res);
        if (res.status === 200) {
          this.setState({
            homes: res.res.listHomes.items
          });
        }
      })
  }

  onModalClose = () => {
    this.setState({
      createModalPresented: false,
      joinModalPresented: false,
      profileCompletionModalPresented: false
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

  successfulHomeSelection = async (homeId) => {
    this.setState({
      homeId,
      createModalPresented: false,
      joinModalPresented: false,
      profileCompletionModalPresented: true
    })
  }

  render() {
    return (
      <View style={styles.homeSelectorContainer}>
        <View style={styles.textWrapper}>
          <Text style={styles.mainText}>
            Hello & welcome to EggPlanner. {"\n"}
            <Text style={styles.mainTextBody}>
              In order to get started you have to create a new Home or join an existing one.
            </Text>
          </Text>
        </View>
        <View style={styles.guideWrapper}>
          <View style={styles.navigationWrapper}>
          <TouchableOpacity style={styles.imageWrapper} onPress={this.onCreateHomePress}>
            <Image source={require('../../../assets/images/eggplant_single.png')} style={styles.imageStyle}/>
          </TouchableOpacity>
          <Text style={styles.navigationText}>
            Create
          </Text>
          </View>
          <View style={styles.navigationWrapper}>
          <TouchableOpacity style={styles.imageWrapper} onPress={this.onJoinHomePress}>
            <Image source={require('../../../assets/images/eggplant_double.png')} style={styles.imageStyle} />
          </TouchableOpacity>
          <Text style={styles.navigationText}>
            Join
          </Text>
          </View>
        </View>
        <HomeSelectorModal 
          createModalPresented={this.state.createModalPresented}
          joinModalPresented={this.state.joinModalPresented}
          onModalClose={this.onModalClose}
          homes={this.state.homes}
          user={this.props.homeContext.currentUser}
          successfulHomeSelection={this.successfulHomeSelection}
        />
        <ProfileCompletionModal
          profileCompletionModalPresented={this.state.profileCompletionModalPresented}
          sub={this.props.homeContext.sub}
          homeId={this.state.homeId}
          onModalClose={this.onModalClose}
          completedSignUp={this.props.completedSignUp}
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
  },

  navigationWrapper: {
    flex: 0,
    alignItems: 'center'
  },

  navigationText: {
    fontSize: 18,
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
