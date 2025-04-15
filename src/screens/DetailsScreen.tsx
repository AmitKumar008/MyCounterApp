import {View, Text, StyleSheet,ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-root-toast';
import axios from 'axios';

const DetailsScreen = (props: {route: {params: {itemId: any}}}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState('');

  const showToast = (message: any) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
    });
  };

  useEffect(() => {
    fetchDetailData();
  }, []);

  const fetchDetailData = async () => {
    showToast('FETCHING DATA IN CHILD COMPONENT.');
    setLoading(true);

    const baseURL = 'https://jsonplaceholder.typicode.com/posts/';
    const itemId = props?.route?.params?.itemId;

    if (!itemId) {
      console.error('Invalid itemId:', itemId);
      setLoading(false);
      return;
    }

    const mainURL = `${baseURL}${itemId}`;

    try {
      const resp = await axios.get(mainURL);
      setData(resp.data);
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        <View style={styles.item}>
          <Text style={styles.textIdStyle}>Id: {data?.id}</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>
              <Text style={styles.textIdStyle}>Title:</Text> {data?.title}
            </Text>
          </View>
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  item: {
    padding: 15,
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
