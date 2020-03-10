import React from 'react';
import { View, ScrollView, Dimensions, Image, Text } from 'react-native';

const deviceWidth = Dimensions.get('window').width;

class BackgroundCarousel extends React.Component {
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

  setSelectedIndex = (event) => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;

    const selectedIndex = Math.floor(contentOffset / viewSize);
    
    this.setState({ selectedIndex });
  }

  render() {
    const {images} = this.props;
    const {selectedIndex} = this.state;
    return (
      <View style={{height: '50%'}}>
        <Text style={styles.titleText}>{this.props.title}</Text>
        <ScrollView 
          horizontal
          pagingEnabled 
          onMomentumScrollEnd={this.setSelectedIndex}
          ref={this.scrollRef}
          style={{ backgroundColor: 'rgba(50,50,50,.4)' }}
        >
          {images.map(image => (
            <Image
              key={image}
              source={{uri: image}}
              style={styles.backgroundImage}
             />
             ))}
        </ScrollView>
        {/* <View style={{ position: 'absolute', height: '100%', width: '100%', backgroundColor: 'rgba(50,50,50,.4)', zIndex: 1, top: 0 }}></View> */}
        <View style={styles.circleWrapper}>
          {images.map((image, i) => (
            <View 
              key={image}
              style={[styles.whiteCircle, {opacity: i === selectedIndex ? 1 : 0.5}]}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = {
  backgroundImage: {
    height: '100%',
    width: deviceWidth,
    position: 'relative',
    opacity: .6
  },

  circleWrapper: {
    position: 'absolute',
    bottom: 15,
    height: 10,
    width: '100%',
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  },

  whiteCircle: {
    height: 6,
    width: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: 'white'
  },

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
export { BackgroundCarousel };