import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';
import React from 'react';

const ListTab = ({items, tabClick}: {items: any; tabClick: Function}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        tabClick(items?.id);
      }}
      style={styles.item}>
      <Text style={styles.textIdStyle}>Id: {items?.id}</Text>
      <View style={styles.titleContainer}>
        <Text style={styles.titleStyle}>
          <Text style={styles.textIdStyle}>Title:</Text> {items?.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(ListTab);
const styles = StyleSheet.create({
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    borderRadius: 10,
  },
  textIdStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  titleContainer: {
    marginTop: 7,
  },
  titleStyle: {
    color: 'black',
    fontSize: 14,
    textAlign: 'left',
  },
});
