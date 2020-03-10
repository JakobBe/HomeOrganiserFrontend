import { Dimensions } from 'react-native';

const sizes = {
  896: '11',
  812: 'X',
  736: 'Plus',
  667: '7',
  568: '5'
}
const deviceHeight = Dimensions.get('window').height
const deviceWidth = Dimensions.get('window').width
const size = sizes[deviceHeight];

export { deviceHeight, deviceWidth, size }