import React, {useState, useEffect} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, Caption, List} from 'react-native-paper';
import {Icon, ListItem} from 'react-native-elements';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import axios from 'axios';
import Overview from '../components/Overview';
import DetailList from '../components/DetailsList';

momentDurationFormatSetup(moment);

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const HostDetails = ({route}) => {
  const {name, description, domain, port, key, type} = route.params.item;
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [overview, setOverview] = useState([]);
  const [platform, setPlatform] = useState('');
  const [uptime, setUptime] = useState('');

  useEffect(() => {
    let mounted = true;
    try {
      console.log('fetching data...');

      fetch(`http://${domain}:${port}/api/v1/?key=${key}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(res => {
          if (mounted) {
            const duration = moment.duration(res.host.uptime, 'seconds');
            const formatted = duration.format('hh:mm:ss');
            setOverview(res);
            setUptime('Uptime: ' + formatted);
            setPlatform(res.host.platform);
            setIsLoading(false);
            setConnected(true);
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let retries = 0;
    let isCancelled = false;
    const interval = setInterval(() => {
      console.log('fetching data...');
      console.log(`http://${domain}:${port}/api/v1/?key=${key}`);
      console.log('isCancelled?');
      console.log(isCancelled);
      console.log('retries');
      console.log(retries);

      axios({
        url: `http://${domain}:${port}/api/v1/?key=${key}`,
        method: 'GET',
        timeout: 1000,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(res => {
          res = res.data;
          if (!isCancelled) {
            const duration = moment.duration(res.host.uptime, 'seconds');
            const formatted = duration.format('hh:mm:ss');
            setOverview(res);
            setUptime('Uptime: ' + formatted);
            setPlatform(res.host.platform);
            setIsLoading(false);
            setConnected(true);
          }
        })
        .catch(() => {
          retries += 1;
        });
      if (retries === 2) {
        if (!isCancelled) {
          clearInterval(interval);
          setIsLoading(false);
          setConnected(false);
        }
      }
    }, 1000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  const setIcon = type => {
    switch (type) {
      case 'Laptop':
        return (
          <Icon name="computer" type="material" color="#517fa4" size={40} />
        );
      case 'Server':
        return (
          <Icon
            name="server"
            type="material-community"
            color="#517fa4"
            size={40}
          />
        );
      case 'PC':
        return (
          <Icon
            name="desktop-tower-monitor"
            type="material-community"
            color="#517fa4"
            size={40}
          />
        );
      default:
        return (
          <Icon
            name="server"
            type="material-community"
            color="#517fa4"
            size={40}
          />
        );
    }
  };

  const setOSIcon = type => {
    switch (type) {
      case 'linux':
        return (
          <Icon
            name="linux"
            type="font-awesome-5"
            color="#517fa4"
            iconStyle={{}}
            containerStyle={{flexDirection: 'row'}}
          />
        );
      case 'windows':
        return <Icon name="server" type="material-community" color="#517fa4" />;
      case 'mac':
        return <Icon name="computer" type="material" color="#517fa4" />;
      default:
        return <Icon name="server" type="material-community" color="#517fa4" />;
    }
  };

  return (
    <ScrollView>
      <Card>
        <Card.Title
          subtitle={`${capitalize(description)} \n${uptime}`}
          subtitleNumberOfLines={2}
          left={() => setIcon(type)}
        />
      </Card>
      <List.Subheader>Information</List.Subheader>
      {connected && !isLoading && (
        <ListItem
          title={capitalize(overview.host.platform).concat(
            ' / ' + overview.host.arch,
          )}
          subtitle={'System'}
          leftIcon={setOSIcon(overview.host.os)}
        />
      )}
      {!connected && !isLoading && (
        <Caption style={styles.caption}>Can't connect to host</Caption>
      )}

      {connected && !isLoading && (
        <>
          <Overview overview={overview}/>
          <DetailList />
        </>
      )}
      {!connected && isLoading && (
        <View>
          <List.Section>
            <List.Subheader>Overview</List.Subheader>
            <ShimmerPlaceHolder
              autoRun={true}
              style={{width: '100%', height: 150}}
            />
            <List.Subheader>Details</List.Subheader>
            <ShimmerPlaceHolder
              autoRun={true}
              style={{width: '100%', height: 150}}
            />
          </List.Section>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  caption: {
    marginLeft: 26,
  },
});

export default HostDetails;
