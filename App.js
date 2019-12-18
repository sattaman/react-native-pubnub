import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

import {
  Header
} from 'react-native/Libraries/NewAppScreen';

import Push from './Push';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Header />
          <Push />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default App;
