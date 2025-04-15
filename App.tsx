import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import {NativeBaseProvider} from 'native-base';
import {NavigationContainer} from '@react-navigation/native';
import RootStackNavigator from './src/navigation/RootStackNavigator';
import {RootSiblingParent} from 'react-native-root-siblings';

function App(): React.JSX.Element {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" />
      <SafeAreaView style={styles.container}>
        <NativeBaseProvider>
          <NavigationContainer>
            <RootSiblingParent>
              <RootStackNavigator />
            </RootSiblingParent>
          </NavigationContainer>
        </NativeBaseProvider>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
});

export default App;
