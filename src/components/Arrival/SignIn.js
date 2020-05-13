import React, { Component } from 'react';
import { Input, Button, Spinner } from '../Common';
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import { HomeContext } from '../../contexts/HomeContextHolder';
import { signIn, RejectionErros, getUsersHandler } from '../../AWSClient';
import { layouts } from '../../Style';
import EmailVerificationModal from './EmailVerificationModal';

class SignIn extends Component {
  state = {
    loading: false,
    email: 'jakob.bethmann+9@gmail.com',
    password: '123456',
    error: '',
    cognitoSub: '',
    emailVerificationModalPresented: false
  }

  onEmailChange(text) {
    this.setState({
      email: text.toLowerCase()
    });
  }

  onPasswordChange(text) {
    this.setState({
      password: text
    });
  }

  onLoginButtonPress = async () => {
    const { email, password } = this.state;

    if (email.length === 0 || password.length === 0) {
      Alert.alert("Please enter an E-Mail address and a password.");
      return
    }

    this.setState({
      loading: true,
      error: ''
    });

    const signInRes = await signIn(email.toLowerCase(), password);
    if (signInRes.status === 400) {
      if (signInRes.res.code === RejectionErros.UserNotFoundException) {
        Alert.alert("Incorrect email or password.");
      }
      if (signInRes.res.code === RejectionErros.NotAuthorizedException) {
        Alert.alert("Incorrect email or password.");
      } 
      if (signInRes.res.code === RejectionErros.UserNotConfirmedException) {
        const cognitoUserRes = await getUsersHandler(email.toLowerCase());
        if (cognitoUserRes.status === 200) {
          this.setState({
            loading: false,
            emailVerificationModalPresented: true,
            cognitoSub: cognitoUserRes.data
          });
        }
      }
      this.setState({
        loading: false
      });
      return
    }

    if (signInRes.status === 200) {
      await this.props.hasSignedIn(signInRes.res.attributes.sub);
      this.setState({
        loading: false
      });
    }
  }

  onEmailVerificationModalClose = () => {
    this.setState({
      emailVerificationModalPresented: false
    });
  }

  renderButton() {
    if (this.state.loading) {
      return <Spinner size='large'/>;
    }

    return (
      <Button
        onPress={this.onLoginButtonPress}
        additionalButtonStyles={styles.button}
      >
        Login
      </Button>
    );
  }

  renderError() {
    if (this.state.error.length > 0) {
      return (
        <View style={{ backgroundColor: 'white' }}>
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.loginWrapper}>
        <Input
          label='Email'
          placeholder='email@gmail.com'
          onChangeText={this.onEmailChange.bind(this)}
          value={this.state.email}
          autoFocus={true}
          additionalTextFieldStyle={styles.additionalTextFieldStyle}
          keyboardType={'email-address'}
        />
        <Input
          secureTextEntry
          label='Password'
          placeholder='password'
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.state.password}
          additionalTextFieldStyle={styles.additionalTextFieldStyle}
        />
        {this.renderError()}
        <View style={layouts.centerWrapper}>
          {this.renderButton()}
        </View>
        <TouchableOpacity onPress={() => this.props.navigateSignIn()}>
          <Text style={styles.createAccounTextStyle}>
            Create a new account
          </Text>
        </TouchableOpacity>
        <EmailVerificationModal
          showModal={this.state.emailVerificationModalPresented}
          sub={this.state.cognitoSub}
          hasSignedUp={this.props.hasSignedUp}
          onModalClose={this.onEmailVerificationModalClose}
        />
      </View>
    )
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },

  additionalTextFieldStyle: {
    backgroundColor: 'transparent'
  },

  createAccounTextStyle: {
    marginTop: 20,
    fontSize: 15,
    alignSelf: 'center',
    color: 'grey',
    textDecorationLine: 'underline' 
  },

  button: {
    marginTop: 35,
  },
  
  loginWrapper: {
    flex: 0,
    // transform: [
    //   {perspective: 1000 }, 
    //   { translateX: 0 },
    //   { rotateY: '18rad'},
    //   // { translateX: -100 },
    //   { scale: 0.8 }
    // ]
  },
}

export default (props) => (
  <HomeContext.Consumer>
    {homeContext => <SignIn {...props} homeContext={homeContext} />}
  </HomeContext.Consumer>
);
