import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { UserContext } from '../contexts/UserContextHolder';
import { HomeContext } from '../contexts/HomeContextHolder';
import { Input, Button, Footer } from '../Common';
import { updateUser } from '../RailsClient';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette } from '../Style';

class ProfileModal extends Component {
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
          Actions.entry({ type: ActionConst.REPLACE })
        }
      })
  }

  render() {
    const { name, color, email, payPalMeLink } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.profileModalActive}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.profileContainer(color)}>
            <TouchableOpacity
              onPress={() => this.props.onModalClose()}
              style={{ top: 3, left: '85%' }}
            >
              <Text style={{ color: colorPalette.primary, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
            <View style={styles.imageWrapper}>
              <Image source={require('../../assets/images/user-black.png')} style={styles.imageStyle} />
            </View>
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
                {/* <Input
                  value={email}
                  onChangeText={value => this.setState({ email: value })}
                  label='E-Mail'
                /> */}
                <Input
                  value={payPalMeLink}
                  onChangeText={value => this.setState({ payPalMeLink: value })}
                  label='PayPal Link'
                />
              </ScrollView>
            </View>
            <Button onPress={this.onButtonPress} additionalButtonStyles={styles.buttonStyle}>
              Update
            </Button>
          </View>
        </View>
      </Modal>
    );
  };
};

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  profileContainer: (color) => ({
    margin: 30,
    marginTop: 110,
    marginBottom: 110,
    backgroundColor: color,
    widht: '100%',
    borderRadius: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
  }),

  profileWrapper: {
    backgroundColor: 'rgb(255,255,255)',
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },

  inputWrapper: {},

  buttonStyle: {
    marginTop: 20
  },

  imageStyle: {
    height: 50,
    width: 50
  },

  imageWrapper: {
    flex: 0,
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: colorPalette.secondary,
  },
};

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <ProfileModal {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);