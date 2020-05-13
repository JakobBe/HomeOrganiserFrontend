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

  componentDidMount = () => {
    // setInterval(() => {
    //   this.setState(
    //     prev => ({
    //       selectedIndex: prev.selectedIndex === this.props.images.length - 1 ? 0 : prev.selectedIndex + 1
    //     }),
    //     () => {
    //       this.scrollRef.current.scrollTo({
    //         animated: true,
    //         y: 0,
    //         x: deviceWidth * this.state.selectedIndex
    //       });
    //     }
    //   );
    // }, 10000);
  };

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
    console.log('event', event);
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;

    const selectedIndex = Math.floor(contentOffset / viewSize);

    this.setState({ selectedIndex });
  }

  getUserCard = (user) => {
    return (
      <View style={styles.userCardContainer}>
        <View style={styles.userCardHeader}>
          <View>
            <Text style={textStyles.headerStyle}>
              {user.name}
            </Text>
            <View style={styles.userCardColorBlock(user.color)}></View>
          </View>
          <Image
            // key={user}
            source={{ uri: this.getProfileImageUrl(user.id) }}
            style={styles.userCardImg}
          />
        </View>
      </View>
    );
  }

  getHomeCard = (home) => {
    return (
      <View style={styles.userCardContainer}>
        <View style={styles.userCardHeader}>
          <View>
            <Text style={textStyles.headerStyle}>
              {home.name}
            </Text>
            <View style={styles.userCardColorBlock(colorPalette.primary)}></View>
          </View>
          {this.getQRCode(home.id)}
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
          // style={{ width: deviceWidth }}
        >
          {userCarouselArray.map(item => {
            if (item.isHome) {
              return this.getHomeCard(item);
            } else {
              return this.getUserCard(item);
            }
          })}
        </ScrollView>
        {/* <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(50,50,50,.4)', zIndex: 1, top: 0 }}></View> */}
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
    // height: '100%',
    width: deviceWidth - 100,
    alignSelf: 'center',
    // flex: 1,
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

  userCardColorBlock: (color) => ({
    backgroundColor: color,
    height: 15,
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