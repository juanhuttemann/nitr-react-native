import React, {useState, useEffect} from 'react';
import {StyleSheet, Alert} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareFlatList,
} from 'react-native-keyboard-aware-scroll-view';

import {ListItem, Icon, SearchBar} from 'react-native-elements';
import ActionButton from 'react-native-action-button';
import Toast from 'react-native-simple-toast';
import useDebounce from '../hooks/use-debounce';

import PouchDB from 'pouchdb';
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('localDB2', {adapter: 'asyncstorage'});

const setIcon = type => {
  switch (type) {
    case 'Server':
      return <Icon name="server" type="material-community" color="#517fa4" />;
    case 'PC':
      return (
        <Icon
          name="desktop-tower-monitor"
          type="material-community"
          color="#517fa4"
        />
      );
    case 'Laptop':
      return <Icon name="computer" type="material" color="#517fa4" />;
    default:
      return <Icon name="server" type="material-community" color="#517fa4" />;
  }
};

export default ({navigation}) => {
  const [hosts, setHosts] = useState([]);
  const [query, setQuery] = useState('');

  const debouncedQuery = useDebounce(query, 100);

  useEffect(() => {
    (async () => {
      await db
        .allDocs({
          include_docs: true,
          startkey: 'host_',
        })
        .then(function(result) {
          const hostsArr = result.rows
            .map(row => row.doc)
            .sort((a, b) => a.name > b.name);
          setHosts(hostsArr);
        })
        .catch(function(err) {
          console.log(err);
        });
    })();
  }, []);

  useEffect(() => {
    const changes = db
      .changes({
        since: 'now',
        live: true,
        include_docs: true,
        startkey: 'host_',
      })
      .on('change', function(change) {
        (async () => {
          await db
            .allDocs({
              include_docs: true,
              startkey: 'host_',
            })
            .then(function(result) {
              const hostsArr = result.rows
                .map(row => row.doc)
                .sort((a, b) => a.name > b.name);
              setHosts(hostsArr);
            })
            .catch(function(err) {
              console.log(err);
            });
        })();
      })
      .on('error', function(err) {
        console.log(err);
      });
    return () => {
      changes.cancel();
    };
  }, []);

  useEffect(() => {
    if (debouncedQuery) {
      (async () => {
        await db
          .find({
            selector: {
              name: {$regex: RegExp(debouncedQuery, 'i')},
            },
          })
          .then(function(result) {
            const hostsArr = result.docs.sort((a, b) => a.name > b.name);
            setHosts(hostsArr);
          })
          .catch(function(err) {
            Toast.show('Search error');
          });
      })();
    } else {
      (async () => {
        await db
          .allDocs({
            include_docs: true,
            startkey: 'host_',
          })
          .then(function(result) {
            const hostsArr = result.rows
              .map(row => row.doc)
              .sort((a, b) => a.name > b.name);
            setHosts(hostsArr);
          })
          .catch(function(err) {
            Toast.show('Search error');
          });
      })();
    }
  }, [debouncedQuery]);

  const deleteHost = id => {
    db.get(id)
      .then(function(doc) {
        doc._deleted = true;
        return db.put(doc);
      })
      .then(function() {
        Toast.show('Host succesfully removed');
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  const renderRow = ({item}) => {
    return (
      <ListItem
        key={item.name}
        title={item.name}
        subtitle={item.description}
        onPress={() =>
          navigation.push('HostDetails', {
            title: item.name,
            item,
          })
        }
        onLongPress={() =>
          Alert.alert(
            'Attention',
            `Are you sure you want to remove ${item.name}?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'Remove', onPress: () => deleteHost(item._id)},
            ],
            {cancelable: false},
          )
        }
        leftIcon={setIcon(item.type)}
        bottomDivider
        chevron
      />
    );
  };

  return (
    <>
      <SearchBar
        lightTheme={true}
        round={true}
        placeholder="Search host..."
        onChangeText={setQuery}
        value={query}
        containerStyle={{
          padding: 5,
        }}
        inputContainerStyle={{
          backgroundColor: '#FFFFFE',
          height: 36,
          padding: 14,
        }}
        inputStyle={{
          marginTop: 4,
          fontSize: 16,
          color: '#2D3436',
          margin: 0,
        }}
        placeholderTextColor={{
          color: 'black',
        }}
      />
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <KeyboardAwareFlatList
          data={hosts}
          renderItem={renderRow}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.5}
        />
      </KeyboardAwareScrollView>
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#9b59b6"
          title="Add Host via QR"
          onPress={() =>
            navigation.navigate('QRScreen', {
              title: 'Host QR',
            })
          }>
          <Icon
            type="material-community"
            name="qrcode-scan"
            iconStyle={styles.actionButtonIcon}
          />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="Add Host"
          onPress={() =>
            navigation.navigate('HostForm', {
              title: 'New Host',
            })
          }>
          <Icon
            type="material-community"
            name="server-plus"
            iconStyle={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      </ActionButton>
    </>
  );
};

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
