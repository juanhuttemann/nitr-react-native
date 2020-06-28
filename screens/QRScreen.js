import React, {useState, useEffect} from 'react';

import {StyleSheet, Text, View, Button} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import uuid from 'uuid-random';

const QRScreen = ({navigation}) => {
  const [scanned, setScanned] = useState(false);
  const [reactivate, setReactivate] = useState(true);

  useEffect(() => {
    console.log(scanned);
    if (scanned) {
      setReactivate(false);
    }
  }, []);

  const onSuccess = ({data}) => {
    const host = JSON.parse(data);
    console.log(host);
    const hostWithId = {_id: 'host_' + uuid(), ...host};
    navigation.navigate('HostForm', {
      title: 'New Host',
      host: hostWithId,
    });
    setScanned(true);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <QRCodeScanner
        reactivate={reactivate}
        onRead={onSuccess}
        topContent={
          <Text style={styles.buttonText}>
            Scan QR code from the nitr-agent web panel
          </Text>
        }
        bottomContent={
          scanned && (
            <Button
              title={'Tap to Scan Again'}
              onPress={() => {
                setScanned(false);
                setReactivate(true);
              }}
            />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default QRScreen;
