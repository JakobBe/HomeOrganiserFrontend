import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import AWS from 'aws-sdk';
import { awsCognitoConfig, awsS3DevUser } from './aws-exports';
import { getHome } from './graphql/queries'

export const RejectionErros = {
  UsernameExistsException: 'UsernameExistsException',
  UserNotConfirmedException: 'UserNotConfirmedException',
  InvalidParameterException: 'InvalidParameterException',
  UserNotFoundException: 'UserNotFoundException',
  NotAuthorizedException: 'NotAuthorizedException'
}

Amplify.configure(awsCognitoConfig);

export const appSyncGraphQl = async (query, variables) => {
  console.log('query, variables', query, variables);
  try {
    const res = await API.graphql({
      query,
      variables
    });
    return { status: 200, res: res.data }
  } catch (error) {
    return { status: 400, res: error }
  }
}

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
    console.log('res', res);
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
    console.log('res', res);
    return { status: 400, res: error }
  }
};


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

