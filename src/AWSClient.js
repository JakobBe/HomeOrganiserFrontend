import Amplify, { Auth, API } from 'aws-amplify';
import AWS from 'aws-sdk';
import { awsCognitoConfig, awsS3DevUser, awsAppSyncConfig } from './aws-exports';

Amplify.Auth.configure(awsCognitoConfig);
Amplify.API.configure(awsAppSyncConfig);

export const RejectionErros = {
  UsernameExistsException: 'UsernameExistsException',
  UserNotConfirmedException: 'UserNotConfirmedException',
  InvalidParameterException: 'InvalidParameterException',
  UserNotFoundException: 'UserNotFoundException',
  NotAuthorizedException: 'NotAuthorizedException'
}

export const appSyncGraphQl = async ({query, variables, sort, limit, filter}) => {
  try {
    const res = await Amplify.API.graphql({
      query,
      variables,
      sort,
      limit,
      filter
    });
    return { status: 200, res: res.data }
  } catch (error) {
    return { status: 400, res: error }
  }
}

getUsers = (email) => {
  var params = {
    UserPoolId: awsCognitoConfig.userPoolId,
    AttributesToGet: [
      'email',
    ],
    Filter: `email = \"${email}\"`
  };

  return new Promise((resolve, reject) => {
    AWS.config.update({ region: awsCognitoConfig.region, 'accessKeyId': awsS3DevUser.accessKeyId, 'secretAccessKey': awsS3DevUser.secretAccessKeyId });
    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
    cognitoidentityserviceprovider.listUsers(params, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  });
}

export const getUsersHandler = async (email) => {
  const data = await getUsers(email);
  let res = data;

  if (data.Users.length !== 1) {
    res = { status: 400, err: 'NoUserWithThisEmail' }
  }

  if (data.Users.length === 1) {
    res = { status: 200, data: data.Users[0].Username }
  }

  return res;
};


export const signUp = async (email, password) => {
  try {
    const user = await Amplify.Auth.signUp({
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
    const user = await Amplify.Auth.signIn({
      username: email,
      password
    });
    return { status: 200, res: user }
  } catch (error) {
    return { status: 400, res: error }
  }
};

export const confirmUser = async (sub, confirmationCode) => {
  try {
    const confirmation = await Amplify.Auth.confirmSignUp(sub, confirmationCode);
    return { status: 200, res: confirmation }
  } catch (error) {
    return { status: 400, res: error }
  }
}

export const resendConfirmationCode = async (sub) => {
  try {
    const resendRes = await Amplify.Auth.resendSignUp(sub);
    console.log('resendRes', resendRes);
  } catch (error) {
    console.log('erro from resendCC', error);
  }
}

export const getPreSignedUrl = async (key) => {
  const s3Access = new AWS.S3({
    accessKeyId: awsS3DevUser.accessKeyId,
    secretAccessKey: awsS3DevUser.secretAccessKeyId,
    region: awsS3DevUser.region
  });
  
  const s3Params = {
    Bucket: awsS3DevUser.bucket,
    Key: key,
    ContentType: 'image/jpeg'
  }

  const url = await s3Access.getSignedUrl('putObject', s3Params);
  return url;
}

