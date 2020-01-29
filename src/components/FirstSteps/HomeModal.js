import React, { Component } from 'react';
import { Text, Animated, View, TouchableOpacity, Image, ScrollView, Modal } from 'react-native';
import { UserContext } from '../../contexts/UserContextHolder';
import { HomeContext } from '../../contexts/HomeContextHolder';
import { Input, Button, Footer } from '../Common';
import { Actions, ActionConst } from 'react-native-router-flux';
import { colorPalette, deviceWidth, layouts } from '../../Style';
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

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.homeModalActive}
      >
        <View style={styles.transparentBackground}>
          <View style={styles.homeContainer}>
            <TouchableOpacity
              onPress={() => this.props.onModalClose()}
              style={{ top: 3, left: '85%' }}
            >
              <Text style={{ color: colorPalette.primary, fontWeight: 'bold' }}>Close</Text>
            </TouchableOpacity>
            <View>
              <Text style={{ color: colorPalette.secondary, fontWeight: 'bold'  }}>
                {this.props.homeContext.home.name}
              </Text>
              <Text style={{ color: colorPalette.secondary }}>
                There are currently {this.props.homeContext.users.length} people registered for this flat.
              </Text>
            </View>
            <View>
              {this.getQRCode()}
            </View>
          </View>
        </View>
      </Modal>
    );
  };
};

const styles = {
  transparentBackground: {
    height: '100%',
    backgroundColor: 'rgba(100,100,100,.5)'
  },

  homeContainer: {
    margin: 30,
    marginTop: 110,
    marginBottom: 110,
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