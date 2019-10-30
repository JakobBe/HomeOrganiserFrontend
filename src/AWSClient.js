import Amplify, { Auth } from 'aws-amplify';
import awsConfig from './aws-exports';

export const RejectionErros = {
  UsernameExistsException: 'UsernameExistsException',
  UserNotConfirmedException: 'UserNotConfirmedException',
  InvalidParameterException: 'InvalidParameterException',
  UserNotFoundException: 'UserNotFoundException',
  NotAuthorizedException: 'NotAuthorizedException'
}

Amplify.configure(awsConfig);

export const signUp = async (email, password) => {
  try {
    const user = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email
      }
    });
    return {status: 200, res: user}
  } catch (error) {
    return {status: 400, res: error}
  } 
};

export const signIn = async (email, password) => {
  try {
    const user = await Auth.signIn({
      username: email,
      password
    });
    return { status: 200, res: user }
  } catch (error) {
    return { status: 400, res: error }
  }
};

