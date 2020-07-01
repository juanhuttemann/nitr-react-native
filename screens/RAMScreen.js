import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import axios from 'axios';
import {VictoryPie} from 'victory-native';

const data = [
  {quarter: 1, earnings: 13000},
  {quarter: 2, earnings: 16500},
  {quarter: 3, earnings: 14250},
  {quarter: 4, earnings: 19000},
];

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

  const colorSwitcher = {
    fill: data => {
      let color = 'blue';

      if (data.value > 0 && data.value <= 25) {
        color = 'red';
      }

      if (data.value > 25 && data.value <= 50) {
        color = 'orange';
      }

      if (data.value > 50 && data.value <= 75) {
        color = 'yellow';
      }

      if (data.value > 75 && data.value <= 100) {
        color = 'green';
      }

      return color;
    },
    strokeWidth: 0,
  };

  return (
    <View>
      <View style={styles.container}>
        <VictoryPie
          data={[
            {x: 'Used', y: (ramInfo.usage * 100) / ramInfo.total},
            {x: 'Free', y: (ramInfo.free * 100) / ramInfo.total},
          ]}
          colorScale={['orange', 'green']}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
});
