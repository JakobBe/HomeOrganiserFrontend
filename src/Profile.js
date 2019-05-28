import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image } from 'react-native';
import { UserContext } from './contexts/UserContextHolder';
import { HomeContext } from './contexts/HomeContextHolder';
import { Input, Button } from './common';
import { updateUser } from './Client';

class Profile extends Component {
  state = {
    name: '',
    color: '',
    email: ''
  }

  componentDidMount() {
    const { name, color, email } = this.props.userContext.user;
    this.setState({
      name,
      color,
      email
    });
  };

  onButtonPress = () => {
    updateUser(this.props.userContext.user.id, this.state.color.toLowerCase());
  }

  render() {
    const { name, color, email } = this.state;
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          <View style={styles.userLetterStyleContainer(color)}>
            <Text style={styles.userLetterStyle}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <Input
          value={name}
          onChangeText={value => this.setState({ name: value })}
          autoFocus={true}
        />
        <Input
          value={color}
          onChangeText={value => this.setState({ color: value })}
        />
        <Input
          value={email}
          onChangeText={value => this.setState({ email: value })}
        />
        <Button onPress={this.onButtonPress}>
          Change Color
        </Button>
      </View>
    );
  };
};

const styles = {
  profileContainer: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'rgb(255,255,255)',
  },
  profileImageWrapper: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
    paddingBottom: 20,
    borderBottomWidth: 1
  },
  userLetterStyleContainer: (color) => ({
    width: 180,
    height: 180,
    borderRadius: 180 / 2,
    backgroundColor: color,
    justifyContent: 'center'
  }),
  userLetterStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 40
  }
};

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <Profile {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);