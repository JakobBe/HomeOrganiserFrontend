import React from 'react';
import { View, ScrollView, Dimensions, Image, Text } from 'react-native';
import { textStyles } from '../../Style/Text';
import { colorPalette } from '../../Style';
import QRCode from 'react-native-qrcode-svg';

const deviceWidth = Dimensions.get('window').width;

class UserCarousel extends React.Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0
    }
  }

  getProfileImageUrl = (userId) => {
    return `https://egg-planner-dev.s3.eu-central-1.amazonaws.com/${userId}/profile.jpg`;
  }

  getQRCode = (id) => {
    return (
      <QRCode
        level="Q"
        style={styles.userCardImg}
        value={JSON.stringify(
          id
        )}
      />
    )
  }

  setSelectedIndex = (event) => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;

    const selectedIndex = Math.floor(contentOffset / viewSize);

    this.setState({ selectedIndex });
  }

  getUserCard = (user) => {
    return (
      <View style={styles.userCardContainer}>
        <View style={styles.userCardHeader}>
          <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.userLetterStyleContainer(user.color)}>
              <Text style={{ color: 'black', textAlign: 'center'}}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={textStyles.headerStyle}>
              {user.name.slice(1)}
            </Text>
            {/* <View style={styles.userCardColorBlock(user.color)}></View> */}
          </View>
          <Image
            source={{ uri: this.getProfileImageUrl(user.id) }}
            style={styles.userCardImg}
          />
        </View>
      </View>
    );
  }

  render() {
    const { userCarouselArray } = this.props;
    const { selectedIndex } = this.state;
    return (
      <View style={{ height: '20%', backgroundColor: 'rgba(255,255,255,.9)', padding: 30, margin: 20, borderRadius: 10}}>
        <Text style={styles.titleText}>{this.props.title}</Text>
        <ScrollView
          horizontal
          pagingEnabled
          onMomentumScrollEnd={this.setSelectedIndex}
          ref={this.scrollRef}
        >
          {userCarouselArray.map(item => this.getUserCard(item))}
        </ScrollView>
        <View style={styles.circleWrapper}>
          {userCarouselArray.map((item, i) => (
            <View
              key={item.id}
              style={[styles.indicatorCircle, { opacity: i === selectedIndex ? 1 : 0.5 }]}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = {
  circleWrapper: {
    position: 'absolute',
    bottom: 15,
    height: 10,
    width: deviceWidth - 50,
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },

  indicatorCircle: {
    height: 6,
    width: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: 'black',
  },

  userCardContainer: {
    width: deviceWidth - 100,
    alignSelf: 'center',
    position: 'relative',
    padding: 10
  },

  userCardHeader: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  userCardImg: {
    height: 80,
    width: 80,
    borderRadius: 40
  },

  userLetterStyleContainer: (color) => ({
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: color,
    justifyContent: 'center'
  }),

  userCardColorBlock: (color) => ({
    backgroundColor: color,
    height: 5,
    width: '110%'
  }),

  titleText: {
    position: 'absolute',
    top: '40%',
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2.5,
    zIndex: 2,
    right: 5
  }
}
export { UserCarousel };