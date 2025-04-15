// external imports
import * as React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//internal imports
import StackNavigation from './StackNavigator';

const Root = createNativeStackNavigator();

const RootStackNavigator = () => {
  return (
    <Root.Navigator initialRouteName="StackNavigation">
      {/* for stack navigation  */}
      <Root.Screen
        name="StackNavigation"
        options={{headerShown: false}}
        component={StackNavigation}
      />
    </Root.Navigator>
  );
};

export default RootStackNavigator;
