import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HostsStack from './stacks/HostsStack';

const Tab = createBottomTabNavigator();

export default () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Hosts" component={HostsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
