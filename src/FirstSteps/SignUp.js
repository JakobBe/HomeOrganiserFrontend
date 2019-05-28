import React, { Component } from 'react';
import { Card, CardSection, Input, Button, Spinner } from '../common';
import { View, Text, TouchableOpacity } from 'react-native'
import { createSession, createUser } from '../Client';

class Login extends Component {
  state = {
    loading: false,
    email: '',
    password: '',
    error: '',
    name: ''
  };

  onEmailChange(text) {
    this.setState({
      email: text
    });
  };

  onPasswordChange(text) {
    this.setState({
      password: text
    });
  };

  onNameChange(text) {
    this.setState({
      name: text
    });
  };

  onSignUpButtonPress = async () => {
    const { email, password, name } = this.state;
    this.setState({
      loading: true
    });

    await createUser(email, password, name)
      .then((response) => response.json())
      .then((res) => {
        if (res.email === email) {
          this.setState({
            loading: false
          });
          this.props.hasSignedIn(res);
        }
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
    return (
      <Card>
        <Input
          label='Email'
          placeholder='email@gmail.com'
          onChangeText={this.onEmailChange.bind(this)}
          value={this.state.email}
        />
        <Input
          secureTextEntry
          label='Password'
          placeholder='password'
          onChangeText={this.onPasswordChange.bind(this)}
          value={this.state.password}
        />
        <Input
          label='Name'
          placeholder='Name'
          onChangeText={this.onNameChange.bind(this)}
          value={this.state.name}
        />
        {this.renderError()}
        {this.renderButton()}
        <TouchableOpacity onPress={() => this.props.navigateLogin()}>
          <Text style={styles.createAccounTextStyle}>
            Log In
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

export default Login;
