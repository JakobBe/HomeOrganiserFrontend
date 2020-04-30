import React, { Component } from 'react';
import { Input, Button, Spinner } from '../Common';
import { View, Text, TouchableOpacity, Dimensions, Alert } from 'react-native'
import { signUp, RejectionErros } from '../../AWSClient';
import { layouts } from '../../Style';
import EmailVerificationModal from './EmailVerificationModal';

class SignUp extends Component {
  state = {
    loading: false,
    email: '',
    password: '',
    error: '',
    name: '',
    sub: '',
    emailVerificationModalPresented: false
  };

  onEmailChange(text) {
    this.setState({
      email: text.toLowerCase()
    });
  };

  onPasswordChange(text) {
    this.setState({
      password: text
    });
  };

  onSignUpButtonPress = async () => {
    const { email, password } = this.state;
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Please enter an E-Mail address and a password.");
      return
    }
    
    this.setState({
      loading: true
    });


    const signUpRes = await signUp(email.toLowerCase(), password);
    if (signUpRes.status === 400) {
      if (signUpRes.res.code === RejectionErros.UsernameExistsException) {
        Alert.alert("A User with this E-Mail already exists.");
      } else if (signUpRes.res.code === RejectionErros.InvalidParameterException) {
        Alert.alert("E-Mail and / or Password are not in the correct format.");
      };
      this.setState({
        loading: false
      });
      return
    }
    
    if (signUpRes.status === 200) {
      this.setState({
        sub: signUpRes.res.userSub,
        emailVerificationModalPresented: true,
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
      return <Spinner size='large' />;
    }

    return (
      <Button
        onPress={this.onSignUpButtonPress.bind(this)}
        additionalButtonStyles={styles.button}
      >
        Sign up
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
    const deviceHeight = Dimensions.get('window').height
    return (
      <View style={styles.signUpWrapper(deviceHeight)}>
        <Input
          label='Email'
          placeholder='email@gmail.com'
          onChangeText={this.onEmailChange.bind(this)}
          value={this.state.email}
          autoFocus={true}
          additionalTextFieldStyle={styles.additionalTextFieldStyle}
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
            Log In
          </Text>
        </TouchableOpacity>
        <EmailVerificationModal
          showModal={this.state.emailVerificationModalPresented}
          sub={this.state.sub}
          hasSignedUp={this.props.hasSignedUp}
          onModalClose={this.onEmailVerificationModalClose}
        />
      </View>
    )
  }
}

const styles = {
  signUpWrapper: (deviceHeight) => ({
    flex: 0
  }),

  additionalTextFieldStyle: {
    backgroundColor: 'transparent'
  },

  errorTextStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
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
}

export default SignUp;
