import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { UserContext } from './contexts/UserContextHolder';
import { HomeContext } from './contexts/HomeContextHolder';
import { Input, Button, Footer, Spinner } from './components/Common';
// import { updateUser } from '../../RailsClient';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette, deviceWidth, deviceHeight, layouts } from './Style';
import ImagePicker from 'react-native-image-picker';
import { getPreSignedUrl, appSyncGraphQl } from './AWSClient';
import { updateUser } from './graphql/Users/mutations';
import Slider from '@react-native-community/slider';

class Profile extends Component {
  state = {
    id: '',
    name: '',
    color: '',
    email: '',
    paypalLink: '',
    homeId: '',
    profileImage: '',
    loading: false,
    updateImg: false,
    nameEdit: false
  }

  constructor() {
    super();
    const containerHeight = deviceHeight / 1.3;
    const wrapperHeight = deviceHeight / 2.5;
    this.containerHeight = new Animated.Value(containerHeight);
    this.wrapperHeight = new Animated.Value(wrapperHeight);
  }


  componentDidMount() {
    const { name, color, email, paypalLink, homeId, id } = this.props.homeContext.currentUser;
    this.setState({
      id,
      name: name || '',
      color: color || '',
      email: email || '',
      paypalLink: paypalLink || '',
      homeId: homeId || '',
      profileImage: this.getProfileImageUrl(id)
    });
  };

  _keyboardShown = () => {
    const containerHeight = deviceHeight / 1.62;
    const wrapperHeight = deviceHeight / 3.5;
    Animated.timing(
      this.containerHeight,
      {
        toValue: containerHeight,
        duration: 250
      }
    ).start();

    Animated.timing(
      this.wrapperHeight,
      {
        toValue: wrapperHeight,
        duration: 250
      }
    ).start();
  }

  _keyboardHidden = () => {
    const containerHeight = deviceHeight / 1.3;
    const wrapperHeight = deviceHeight / 2.2;
    Animated.timing(
      this.containerHeight,
      {
        toValue: containerHeight,
        duration: 250
      }
    ).start()

    Animated.timing(
      this.wrapperHeight,
      {
        toValue: wrapperHeight,
        duration: 250
      }
    ).start();
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
      this.setState({
        loading: true
      });
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', preSignedUrl);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('Image successfully uploaded to S3', xhr);
              this.setState({
                loading: false,
                updateImg: !this.state.updateImg
              });
            }
          } else {
            console.log('Error while sending the image to S3', xhr);
          }
        }
        xhr.setRequestHeader('Content-Type', 'image/jpeg');
        xhr.send({ uri: response.uri, type: 'image/jpeg', name: 'test.jpg' });
      }
    });

  }

  onButtonPress = () => {
    const { name, paypalLink, color, id } = this.state;
    const variables = {
      input: {
        id,
        name,
        paypalLink,
        color
      }
    };

    appSyncGraphQl(updateUser, variables)
      .then((res) => {
        if (res.status === 200) {
          this.props.homeContext.updateCurrentUser(res.res.updateUser);
        }
      })
  }

  onEditName = () => {
    this.setState({
      nameEdit: !this.state.nameEdit,
    });
    console.log('nameInput', this.nameInput.focus, this.nameInput);
    this.nameInput.focus();
  }

  onNameBlur = () => {
    this._keyboardHidden()
    this.setState({
      nameEdit: false,
    })
  }

  renderProfileImage = () => {
    console.log('this.state.profileImage', this.state.profileImage);
    const uri = this.state.profileImage;
    const imgAddition = this.state.loading ? <Spinner size='large' color={'black'} additionalSpinnerStyle={styles.additionalSpinnerStyle}/> : 
      <TouchableOpacity onPress={() => this.onCameraPress()}>
        <Image source={require('../assets/images/photo-camera.png')} style={styles.cameraImageStyle} />
      </TouchableOpacity>
    // Image.prefetch(uri);

    return (
      <View style={styles.imageWrapper}>
        <Image key={this.state.updateImg} source={{ uri }} style={styles.imageStyle(this.state.loading)} />
        {imgAddition}
        {/* <TouchableOpacity onPress={() => this.onCameraPress()}>
          <Image source={require('../assets/images/photo-camera.png')} style={styles.cameraImageStyle} />
        </TouchableOpacity> */}
      </View>
    );
  }

  render() {
    const { name, color, email, paypalLink } = this.state;
    const containerHeight = deviceHeight / 1.3;
    const wrapperHeight = deviceHeight / 2.2;
    const profileImage = this.renderProfileImage();

    return (
      <Animated.View style={styles.profileContainer(color, this.containerHeight)}>
        {/* <TouchableOpacity
          onPress={() => { this.containerHeight = new Animated.Value(containerHeight), this.wrapperHeight = new Animated.Value(wrapperHeight), this.props.onModalClose() }}
          style={{ top: 3, left: '85%' }}
        >
          <Text style={{ color: colorPalette.primary, fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity> */}
        {profileImage}
        <Animated.View style={styles.inputWrapper(this.wrapperHeight)}>
          <ScrollView>
            <Input
              value={name}
              onChangeText={value => this.setState({ name: value })}
              label='Name'
              onFocus={() => this._keyboardShown()}
              onBlur={this.onNameBlur}
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
              withEdit={true}
              editCallback={this.onEditName}
              editable={this.state.nameEdit}
              newRef={(refName) => {this.nameInput = refName}}
          />
            <Input
              value={color}
              onChangeText={value => this.setState({ color: value.toLowerCase() })}
              label='Your Color'
              onFocus={() => this._keyboardShown()}
              onBlur={() => this._keyboardHidden()}
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
            />
            <Input
              value={paypalLink}
              onChangeText={value => this.setState({ paypalLink: value })}
              label='PayPal Link'
              onFocus={() => this._keyboardShown()}
              onBlur={() => this._keyboardHidden()}
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
            />
            <Input
              value={email}
              onChangeText={value => this.setState({ email: value.toLowerCase() })}
              label='E-Mail'
              onFocus={() => this._keyboardShown()}
              onBlur={() => this._keyboardHidden()}
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
            />
          </ScrollView>
        </Animated.View>
        <View style={layouts.centerWrapper}>
          <Button onPress={this.onButtonPress} additionalButtonStyles={styles.buttonStyle}>
            Update
          </Button>
        </View>
      </Animated.View>
    );
  };
};

const styles = {
  profileContainer: (color, height) => ({
    // margin: 30,
    // marginBottom: deviceHeight / 2.5,
    backgroundColor: 'white',
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
    height: '50%',
  }),

  inputWrapper: (height) => ({
    backgroundColor: 'rgba(240,240,240,.5)',
    borderRadius: 20,
    margin: 5,
    padding: 5,
    height
  }),

  closeImageStyle: {
    height: 25,
    width: 25,
    top: 3,
    left: '90%'
  },

  // buttonStyle: {
  //   marginTop: 20
  // },

  imageStyle: (loading) => ({
    height: deviceHeight / 8,
    width: deviceHeight / 8,
    borderRadius: deviceHeight / 16,
    borderWidth: 2,
    borderColor: colorPalette.secondary,
    opacity: loading ? .5 : 1
  }),

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
  },

  additionalSpinnerStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -5,
    marginTop: 0
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