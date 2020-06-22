import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HostsScreen from '../screens/HostsScreen';

const HomeStack = createStackNavigator();

export default () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Hosts"
        component={HostsScreen}
        options={{tabBarLabel: 'Hosts'}}
      />
    </HomeStack.Navigator>
  );
};
