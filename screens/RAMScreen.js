import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import axios from 'axios';

export default ({route}) => {
  const {domain, port, apikey} = route.params;
  const [ramInfo, setRamInfo] = useState({});

  useEffect(() => {
    let mounted = true;
    try {
      console.log('fetching data...');
      console.log(`http://${domain}:${port}/api/v1/ram?key=${apikey}`);
      fetch(`http://${domain}:${port}/api/v1/ram?key=${apikey}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
        .then(res => res.json())
        .then(res => {
          if (mounted) {
            setRamInfo(res);
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
      axios({
        url: `http://${domain}:${port}/api/v1/ram?key=${apikey}`,
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
            setRamInfo(res);
          }
        })
        .catch(() => {
          retries += 1;
        });
      if (retries === 2) {
        if (!isCancelled) {
          clearInterval(interval);
        }
      }
    }, 1000);
    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <View>
      <Text>{JSON.stringify(ramInfo)}</Text>
    </View>
  );
};
