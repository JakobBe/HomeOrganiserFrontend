import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { UserContext } from './contexts/UserContextHolder';
import { HomeContext } from './contexts/HomeContextHolder';
import { Input, Button, Footer } from './Common';
import { updateUser } from './RailsClient';
import { Actions, ActionConst } from 'react-native-router-flux';

class Profile extends Component {
  state = {
    name: '',
    color: '',
    email: '',
    payPalMeLink: '',
    home_id: ''
  }

  componentDidMount() {
    const { name, color, email, pay_pal_me_link, home_id } = this.props.homeContext.currentUser;
    this.setState({
      name: name || '',
      color: color || '',
      email: email || '',
      payPalMeLink: pay_pal_me_link || '',
      homeId: home_id || ''
    });
  };
f
  onButtonPress = () => {
    updateUser(this.props.homeContext.currentUser.id,
      this.state.color.toLowerCase(),
      this.state.payPalMeLink.toLowerCase(),
      this.state.homeId
    ).then((response) => response.json())
        .then((res) => {
          if (res.status === '200') {
            this.props.homeContext.updateCurrentUser(res.user);
            Actions.profile({ type: ActionConst.REPLACE })
          }
        })
  }

  render() {
    const { name, color, email, payPalMeLink } = this.state;
    return (
      <View style={styles.profileContainer(color)}>
        <View style={styles.profileWrapper}>
          <ScrollView style={styles.inputWrapper}>
            <Input
              value={name}
              onChangeText={value => this.setState({ name: value })}
              label='Name'
            />
            <Input
              value={color}
              onChangeText={value => this.setState({ color: value.toLowerCase() })}
              label='Your Color'
            />
            <Input
              value={email}
              onChangeText={value => this.setState({ email: value })}
              label='E-Mail'
            />
            <Input
              value={payPalMeLink}
              onChangeText={value => this.setState({ payPalMeLink: value })}
              label='PayPal Link'
            />
          </ScrollView>
          <Button onPress={this.onButtonPress} additionalButtonStyles={styles.buttonStyle}>
            Update
          </Button>
        </View>
        <Footer />
      </View>
    );
  };
};

const styles = {
  profileContainer: (color) => ({
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: color,
  }),

  profileWrapper: {
    backgroundColor: 'rgb(255,255,255)',
    margin: 20,
    padding: 20,
    borderRadius: 20,
    height: 400
  },

  inputWrapper: {},

  buttonStyle: {
     marginTop: 20
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