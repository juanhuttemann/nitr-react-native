import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HostsScreen from '../screens/HostsScreen';
import HostFormScreen from '../screens/HostForm';

const HomeStack = createStackNavigator();

export default () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Hosts"
        component={HostsScreen}
        options={{tabBarLabel: 'Hosts', headerShown: false}}
      />
      <HomeStack.Screen
        name="HostForm"
        component={HostFormScreen}
        options={{tabBarLabel: 'HostForm'}}
      />
    </HomeStack.Navigator>
  );
};
