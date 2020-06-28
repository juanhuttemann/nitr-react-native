import React from 'react';
import {View} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {List} from 'react-native-paper';

const Overview = ({navigation, overview}) => {
  return (
    <View>
      <List.Section>
        <List.Subheader>Overview</List.Subheader>
        <ListItem
          title={
            overview.cpuUsage != undefined
              ? overview.cpuUsage.toFixed(2) + ' %'
              : ''
          }
          subtitle="CPU usage"
          onPress={() => {
            navigation.push('CPUScreen', {});
          }}
          leftIcon={<Icon name="cpu" type="feather" color="#517fa4" />}
          bottomDivider
          chevron
        />
        <ListItem
          title={
            overview.ram != undefined
              ? `${(overview.ram.usage / 1024 / 1024).toFixed(2)} of ${(
                  overview.ram.total /
                  1024 /
                  1024
                ).toFixed(2)} MB`
              : ''
          }
          subtitle="Available memory"
          leftIcon={
            <Icon name="memory" type="font-awesome-5" color="#517fa4" />
          }
          bottomDivider
          chevron
        />
      </List.Section>
    </View>
  );
};

export default Overview;
