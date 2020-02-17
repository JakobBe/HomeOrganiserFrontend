import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { Input, Button, Footer } from '../Common';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette, deviceWidth, layouts } from '../../Style';
import ImagePicker from 'react-native-image-picker';
import { getPreSignedUrl, appSyncGraphQl } from '../../AWSClient';
import moment from 'moment';
import { createUser } from '../../graphql/Users/mutations';

class ProfileCompletionModal extends Component {
  state = {
    name: '',
    color: 'grey',
    paypalLink: '',
    profileImage: ''
  }

  getProfileImageUrl = (userId) => {
    return `https://egg-planner-dev.s3.eu-central-1.amazonaws.com/${userId}/profile.jpg`;
  }

  onCameraPress = async () => {
    const options = {
      title: 'Select Profile Picture',
      customButtons: [{ name: 'random', title: 'Get a random picture :)' }],
    };

    const user = this.props.homeContext.currentUser;
    const preSignedUrl = await getPreSignedUrl(`${user.id}/profile.jpg`);

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', preSignedUrl);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('Image successfully uploaded to S3', xhr);
            }
          } else {
            console.log('Error while sending the image to S3', xhr);
          }
        }
        xhr.setRequestHeader('Content-Type', 'image/jpeg');
        xhr.send({ uri: response.uri, type: 'image/jpeg', name: 'test.jpg' });
      }

      const profileImageUrl = this.getProfileImageUrl(user.id);

      this.setState({
        profileImage: profileImageUrl
      });
    });

  }

  onButtonPress = () => {
    const { name, color, paypalLink } = this.state;
    const variables = {
      sub: this.props.sub,
      name,
      homeId: this.props.homeId,
      color,
      paypalLink,
      createdAt: moment.utc().format(),
      updatedAt: moment.utc().format()
    }

    appSyncGraphQl(createUser, variables)
      .then((res) => {
        console.log('User creation after home selection', res);
        if (res.status === '200') {
          this.props.homeContext.createUserSession(res.createUser);
          Actions.entry({ type: ActionConst.REPLACE })
        }
      })
  }

  render() {
    const { name, color, paypalLink } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.profileCompletionModalPresented}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.profileContainer(color)}>
            <Text style={styles.mainText}>Almoste done... let your flatmates know who you are.</Text>
            <View style={styles.imageWrapper}>
              <Image source={{ uri: this.state.profileImage }} style={styles.imageStyle} />
              <TouchableOpacity onPress={() => this.onCameraPress()}>
                <Image source={require('../../../assets/images/photo-camera.png')} style={styles.cameraImageStyle} />
              </TouchableOpacity>
            </View>
            <View style={styles.profileWrapper}>
              <ScrollView style={styles.inputWrapper}>
                <Input
                  value={name}
                  onChangeText={value => this.setState({ name: value })}
                  label='Name*'
                />
                <Input
                  value={color}
                  onChangeText={value => this.setState({ color: value.toLowerCase() })}
                  label='Your Color'
                />
                <Input
                  value={paypalLink}
                  onChangeText={value => this.setState({ paypalLink: value })}
                  label='PayPal Link'
                />
              </ScrollView>
            </View>
            <View style={layouts.centerWrapper}>
              <Button onPress={this.onButtonPress} additionalButtonStyles={styles.buttonStyle}>
                Save
              </Button>
            </View>
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
    marginTop: 50,
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

  mainText: {
    fontSize: 15,
    color: colorPalette.secondary,
    lineHeight: 20,
    letterSpacing: 2.5
  },

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
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colorPalette.secondary,
  },

  imageWrapper: {
    padding: 10,
    position: 'relative',
    flex: 0,
    alignItems: 'center'
  },

  cameraImageStyle: {
    height: 30,
    width: 30,
    position: 'absolute',
    bottom: -7,
    left: 23,
    zIndex: 2
  }
};

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <ProfileCompletionModal {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);