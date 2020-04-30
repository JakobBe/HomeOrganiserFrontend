import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal, FlatList } from 'react-native';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { Input, Button, Footer } from '../Common';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette, deviceHeight, layouts, textStyles } from '../../Style';
import ImagePicker from 'react-native-image-picker';
import QRCode from 'react-native-qrcode-svg';

class HomeModal extends Component {

  getQRCode = () => {
    return (
      <QRCode
        level="Q"
        style={{ width: 256 }}
        value={JSON.stringify(
          this.props.homeContext.home
        )}
      />
    )
  }

  getProfileImageUrl = (userId) => {
    return `https://egg-planner-dev.s3.eu-central-1.amazonaws.com/${userId}/profile.jpg`;
  }

  renderProfileCard = ({item}) => {
    return (
      <View style={styles.profileCard(item.color)}>
        <Image source={{ uri: this.getProfileImageUrl(item.id) }} style={styles.profileImageStyle} />
        <Text style={textStyles.normalText}>
          {item.name}
        </Text>
        <Text style={textStyles.normalText}>
          {item.email}
        </Text>
      </View>
    )
  }

  render() {
    const roommates = this.props.homeContext.users;
    const extractKey = ({ id }) => id
    return (
      // <Modal
      //   animationType="slide"
      //   transparent={true}
      //   visible={this.props.homeModalActive}
      // >
      //   <View style={styles.transparentBackground}>
          <View style={styles.homeContainer}>
            {/* <TouchableOpacity
              onPress={ () => this.props.onModalClose() }
            >
              <Image source={require('../../../assets/images/close.png')} style={styles.closeImageStyle} />
            </TouchableOpacity> */}
            <Text style={[textStyles.headerStyle, styles.headerStyle]}>
              {this.props.homeContext.name}
            </Text>
            <View style={layouts.centerWrapper}>
              {this.getQRCode()}
            </View>
            <Text style={[textStyles.normalText, {margin: 20 }]}>
              There are currently {this.props.homeContext.users.length} roomies registered for this home.
            </Text>
            <View style={styles.profileCardsWrapper}>
              <FlatList
                style={styles.container}
                data={roommates}
                renderItem={this.renderProfileCard}
                keyExtractor={extractKey}
              />
            </View>
          </View>
      //   </View>
      // </Modal>
    );
  };
};

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  closeImageStyle: {
    height: 25,
    width: 25,
    top: 3,
    left: '90%'
  },

  homeContainer: {
    margin: 30,
    marginTop: 50,
    // marginBottom: 110,
    backgroundColor: 'rgb(255,255,255)',
    widht: '100%',
    borderRadius: 10,
    borderColor: colorPalette.primary,
    borderStyle: 'solid',
    borderWidth: .5,
    padding: 20,
    position: 'relative',
    flex: 0,
    justifyContent: 'space-between',
  },

  headerStyle: {
    textAlign: 'center',
    marginBottom: 20,
  },

  profileCard: (borderColor) => ({
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'rgba(240,240,240,.9)',
    borderRadius: 40,
    borderWidth: 1,
    borderColor
  }),

  profileCardText: {
    color: 'black',
    fontSize: 15,
    letterSpacing: 2
  },

  profileImageStyle: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colorPalette.secondary,
    marginLeft: -1
  },

  profileCardsWrapper: {
    flex: 0,
    height: deviceHeight / 2.6
  }
};

export default (props) => (
  <UserContext.Consumer>
    {userContext =>
      <HomeContext.Consumer>
        {homeContext => <HomeModal {...props} homeContext={homeContext} userContext={userContext} />}
      </HomeContext.Consumer>
    }
  </UserContext.Consumer>
);