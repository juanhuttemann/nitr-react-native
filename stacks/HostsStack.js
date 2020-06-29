import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from 'react-navigation-header-buttons';

import HostsScreen from '../screens/HostsScreen';
import HostFormScreen from '../screens/HostForm';
import HostDetailsScreen from '../screens/HostDetails';
import QRScreen from '../screens/QRScreen';
import CPUScreen from '../screens/CPUScreen';
import RAMScreen from '../screens/RAMScreen';

const HomeStack = createStackNavigator();

const IoniconsHeaderButton = props => (
  <HeaderButton {...props} iconSize={23} color="#517fa4" />
);

const ReusableSelectItem = ({onPress}) => (
  <Item title="Edit" onPress={onPress} />
);

export default ({navigation}) => {
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
        options={({route}) => ({
          title: route.params.title,
        })}
      />
      <HomeStack.Screen
        name="QRScreen"
        component={QRScreen}
        options={{
          title: 'Add host via QR',
        }}
      />
      <HomeStack.Screen
        name="HostDetails"
        component={HostDetailsScreen}
        options={({route}) => ({
          title: route.params.title,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <ReusableSelectItem
                onPress={() =>
                  navigation.navigate('HostForm', {
                    title: `Edit ${route.params.title}`,
                    host: route.params.item,
                  })
                }
              />
            </HeaderButtons>
          ),
        })}
      />
      <HomeStack.Screen
        name="CPUScreen"
        component={CPUScreen}
        options={{
          title: 'CPU Information',
        }}
      />
      <HomeStack.Screen
        name="RAMScreen"
        component={RAMScreen}
        options={{
          title: 'RAM Information',
        }}
      />
    </HomeStack.Navigator>
  );
};
