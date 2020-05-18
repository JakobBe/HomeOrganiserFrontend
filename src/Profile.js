import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal, Alert } from 'react-native';
import { UserContext } from './contexts/UserContextHolder';
import { HomeContext } from './contexts/HomeContextHolder';
import { Input, Button, Footer, Spinner, ColorSlider } from './components/Common';
// import { updateUser } from '../../RailsClient';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette, deviceWidth, deviceHeight, layouts } from './Style';
import ImagePicker from 'react-native-image-picker';
import { getPreSignedUrl, appSyncGraphQl } from './AWSClient';
import { updateUser } from './graphql/Users/mutations';

class Profile extends Component {
  state = {
    id: '',
    name: '',
    color: '',
    email: '',
    paypalLink: undefined,
    homeId: '',
    profileImage: '',
    loading: false,
    updateImg: false,
    nameEdit: false,
    colorEdit: false,
    paypalLinkEdit: false,
    saveButtonActive: true
  }

  constructor() {
    super();
    const containerHeight = deviceHeight / 1.3;
    const wrapperHeight = deviceHeight / 1.5;
    this.containerHeight = new Animated.Value(containerHeight);
    this.wrapperHeight = new Animated.Value(wrapperHeight);
  }


  componentDidMount() {
    if (this.props.homeContext.currentUser === undefined) {
      Alert.alert("Almost done! We juts need a Name and your color so your Housemates know who you are.");
    }

    if (this.props.homeContext.currentUser) {
      const { name, color, email, paypalLink, homeId, id } = this.props.homeContext.currentUser;
  
      this.setState({
        id,
        name: name || '',
        color: color || '',
        email: email || '',
        paypalLink: paypalLink || undefined,
        homeId: homeId || '',
        profileImage: this.getProfileImageUrl(id)
      });
    }
  };

  componentDidUpdate() {
    if (this.state.nameEdit) {
      this.nameInput.focus();
    }

    if (this.state.paypalLinkEdit) {
      this.paypalLinkInput.focus();
    }
  }

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
    const wrapperHeight = deviceHeight / 1.5;
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

  updateCurrentUser = (color) => {
    this.setState({
      loading: true
    });

    const { name, paypalLink, id } = this.state;
    const variables = {
      input: {
        id,
        name,
        paypalLink,
        color: color ? color : this.state.color
      }
    };

    appSyncGraphQl({query: updateUser, variables})
      .then((res) => {
        console.log('res from updating user', res);
        if (res.status === 200) {
          this.props.homeContext.updateCurrentUser(res.res.updateUser);
          this.setState({
            loading: false
          });
        }
      })
  }

  onNameEdit = () => {
    this.setState({
      nameEdit: !this.state.nameEdit,
      saveButtonActive: true
    });
  }

  onNameBlur = () => {
    if (this.state.name.length === 0) {
      Alert.alert("You cant leave this field blank.");
      return;
    }

    this._keyboardHidden();
    this.setState({
      nameEdit: false,
    });
    this.updateCurrentUser();
  }

  onColorEdit = () => {
    this.setState({
      colorEdit: !this.state.colorEdit,
      saveButtonActive: true
    });
  }

  onColorChange = (colorCode) => {
    const color = `rgb(${colorCode.r},${colorCode.g},${colorCode.b})`
    this.setState({
      color,
      colorEdit: false
    });
    this.updateCurrentUser(color);
  }

  onPaypalLinkEdit = () => {
    this.setState({
      paypalLinkEdit: !this.state.paypalLinkEdit,
      saveButtonActive: true
    });
  }

  onPaypalLinkBlur = () => {
    this._keyboardHidden()
    this.setState({
      paypalLinkEdit: false,
    });
    this.updateCurrentUser();
  }

  renderProfileImage = () => {
    const uri = this.state.profileImage;
    const imgAddition = this.state.loading ? <Spinner size='large' color={'black'} additionalSpinnerStyle={styles.additionalSpinnerStyle}/> : 
      <TouchableOpacity onPress={() => this.onCameraPress()}>
        <Image source={require('../assets/images/photo-camera.png')} style={styles.cameraImageStyle} />
      </TouchableOpacity>

    return (
      <View style={styles.imageWrapper}>
        <Image key={this.state.updateImg} source={{ uri }} style={styles.imageStyle(this.state.loading)} />
        {imgAddition}
      </View>
    );
  }

  renderSaveButton = () => {
    if (this.state.saveButtonActive) {
      return (
        <View style={layouts.centerWrapper}>
          <Button onPress={this.onButtonPress} additionalButtonStyles={styles.buttonStyle(this.state.saveButtonActive)}>
            Save
            </Button>
        </View>
      );
    }
  }

  renderColorSlider = () => {
    if (this.state.colorEdit) {
      const prevColorCodeArr = this.state.color.includes('rgb') ? this.state.color.split('(')[1].split(',') : ['255', '0', '0'];
      const prevColorCode = { r: parseInt(prevColorCodeArr[0]), g: parseInt(prevColorCodeArr[1]), b: parseInt(prevColorCodeArr[2])};

      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.colorEdit}
        >
          <View style={styles.colorModalContainer}>
            <ColorSlider
              onColorChange={this.onColorChange}
              prevColorCode={prevColorCode}

            />
          </View>
        </Modal>
      );
    }
  }

  render() {
    console.log('render Profile');
    const { name, color, email, paypalLink } = this.state;
    const containerHeight = deviceHeight / 1.3;
    const wrapperHeight = deviceHeight / 2.2;
    const profileImage = this.renderProfileImage();
    const saveButton = this.renderSaveButton();
    const colorSlider = this.renderColorSlider();

    return (
      <Animated.View style={styles.profileContainer(color, this.containerHeight)}>
        {profileImage}
        <Animated.View style={styles.inputWrapper(this.wrapperHeight)}>
          <ScrollView>
            <Input
              newRef={(refName) => {this.nameInput = refName}}
              value={name}
              onChangeText={value => this.setState({ name: value })}
              label='Name'
              onFocus={() => this._keyboardShown()}
              onBlur={this.onNameBlur}
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
              withEdit={true}
              editCallback={this.onNameEdit}
              editable={this.state.nameEdit}
            />
            <Input
              label='Your Color'
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
              color={this.state.color}
              withEdit={true}
              editCallback={this.onColorEdit}
              editable={this.state.colorEdit}
            />
            {colorSlider}
            <Input
              newRef={(refPaypalLink) => { this.paypalLinkInput = refPaypalLink }}
              value={paypalLink}
              onChangeText={value => this.setState({ paypalLink: value })}
              label='PayPal Link'
              onFocus={() => this._keyboardShown()}
              onBlur={this.onPaypalLinkBlur}
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
              withEdit={true}
              editCallback={this.onPaypalLinkEdit}
              editable={this.state.paypalLinkEdit}
            />
            {/* <Input
              value={email}
              onChangeText={value => this.setState({ email: value.toLowerCase() })}
              label='E-Mail'
              onFocus={() => this._keyboardShown()}
              onBlur={() => this._keyboardHidden()}
              additionalTextFieldStyle={{ backgroundColor: 'transparent' }}
            /> */}
          </ScrollView>
          {/* {saveButton} */}
        </Animated.View>
        
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

  buttonStyle: (buttonActive) => ({
    backgroundColor: buttonActive ? 'rgba(36,36,36,1)' : 'rgba(36,36,36,.5)',
  }),

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
  },

  colorModalContainer: {
    height: '100%',
    backgroundColor: 'rgba(36,36,36,.9)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
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