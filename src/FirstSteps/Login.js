import React, { Component } from 'react';
import { Card, CardSection, Input, Button, Spinner } from '../common';
import { View, Text, TouchableOpacity } from 'react-native'
import { UserContext } from '../contexts/UserContextHolder';

class Login extends Component {
  state = {
    loading: false,
    email: '',
    password: '',
    error: ''
  }

  onEmailChange(text) {
    this.setState({
      email: text
    });
  }

  onPasswordChange(text) {
    this.setState({
      password: text
    });
  }

  onLoginButtonPress = async () => {
    const { email, password } = this.state;
    this.setState({
      loading: true,
      error: ''
    });

    const result = await this.props.userContext.onLoginButtonPress(email, password)

    if (result.status === 'Logged In') {
      this.setState({
        loading: false
      });
      this.props.hasSignedIn(result.user);
    } else if (result.status === 'Email or password is invalid') {
      this.setState({
        loading: false,
        error: result.status
      });
    }
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
      <Card>
        <Input
          label='Email'
          placeholder='email@gmail.com'
          onChangeText={this.onEmailChange.bind(this)}
          value={this.state.email}
          autoFocus={true}
        />
        <Input
          secureTextEntry
          label='Password'
          placeholder='password'
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.state.password}
        />
        {this.renderError()}
        {this.renderButton()}
        <TouchableOpacity onPress={() => this.props.navigateLogin()}>
          <Text style={styles.createAccounTextStyle}>
            Create a new account
          </Text>
        </TouchableOpacity>
      </Card>
    )
  }
}

const styles = {
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
    height: 40,
    backgroundColor: '#05004e',
    marginTop: 10,
    alignItems: 'center'
  },
}

export default (props) => (
  <UserContext.Consumer>
    {userContext => <Login {...props} userContext={userContext} />}
  </UserContext.Consumer>
);
