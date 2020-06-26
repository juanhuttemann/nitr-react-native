import React from 'react';
import {View} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {List} from 'react-native-paper';

const DetailList = ({navigation}) => {
  return (
    <View>
      <List.Section>
        <List.Subheader>Details</List.Subheader>
        <ListItem
          title="Storage"
          subtitle="View monitored storage units"
          leftIcon={
            <Icon name="harddisk" type="material-community" color="#517fa4" />
          }
          bottomDivider
          chevron
        />
        <ListItem
          title="Network"
          subtitle="View monitored network interfaces"
          leftIcon={
            <Icon name="network-wired" type="font-awesome-5" color="#517fa4" />
          }
          bottomDivider
          chevron
        />
        <ListItem
          title="Processes"
          subtitle="View running processes"
          leftIcon={
            <Icon name="pulse" type="material-community" color="#517fa4" />
          }
          bottomDivider
          chevron
        />
      </List.Section>
    </View>
  );
};

export default DetailList;
