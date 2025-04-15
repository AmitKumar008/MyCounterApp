// import { View, Text } from 'react-native';

// import React, { useEffect } from 'react';
// import axios from 'axios';

// const HomeScreen = () => {
//   const [isLoading, setIsLoading] = useState(false);

// useEffect(() => {
//     GetCategoryBlogApi();
//   }, []);

//   const GetCategoryBlogApi = async () => {
//     const usertkn = await AsyncStorage.getItem("authToken");
//     // console.log('token::::::', usertkn);
//     setIsLoading(true);
//     try {

//       const response = await axios.get(`${API.BLOG_MAIN_SCREEN}`,
//         { headers: { "Authorization": ` ${usertkn}` } }
//       );
//       console.log(response);

//     }
//     catch (error) {
//     console.log(response);or.........", error.response.data.message);
//       // setIsLoading(false);

//     }
//     setIsLoading(false);
//   };
//   return (
//     <View>
//       <Text>HomeScreen</Text>
//     </View>
//   )
// }

// export default HomeScreen

import axios from 'axios';
import React, {useEffect, useState, useMemo, useCallback, useRef} from 'react';
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Toast from 'react-native-root-toast';
import ListTab from './ListTab';

const HomeScreen = (props: {
  navigation: {navigate: (arg0: string, arg1: {itemId: any}) => void};
}) => {
  const pagination = useRef({
    currentPage: 1,
    lastPage: 1,
    loader: false,
  });
  const [counter, setCounter] = useState(0);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationLoader, setPaginationLoader] = useState<boolean>(false);
  const [shouldRefresh, setshouldRefresh] = useState<boolean>(false);

  const showToast = (message: any) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
    });
  };

  useEffect(() => {
    setData([]);
    setLoading(true);
    pagination.current.currentPage = 1;
    pagination.current.lastPage = 1;
    pagination.current.loader = false;
    getInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //pull down to refresh
  const checkon = () => {
    setData([]);
    setLoading(true);
    setshouldRefresh(true);
    pagination.current.currentPage = 1;
    pagination.current.lastPage = 1;
    pagination.current.loader = false;
    getInitialData();
  };
  const wait = (timeout: number | undefined) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    checkon();
    wait(2000).then(() => {
      setshouldRefresh(false);
    });
  }, []);

  //Intital Function CAll
  const getInitialData = async () => {
    fetchData(true);
  };
  const fetchData = async (loader: boolean, currentPage = 1) => {
    loader && !loading && setLoading(true);
    showToast('FETCHING DATA.');
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/posts',
        {
          params: {
            _page: currentPage,
            _limit: 10,
          },
        },
      );

      const totalCount = parseInt(response.headers['x-total-count'], 10);
      const lastPage = Math.ceil(totalCount / 10);

      showToast('FETCHING DATA COMPLETE.');
      setData(preData => [...preData, ...response?.data]);
      pagination.current.currentPage = currentPage + 1;
      pagination.current.lastPage = lastPage;
      pagination.current.loader = false;
      setLoading(false);
    } catch (error) {
      console.error(error);
      showToast('FETCHING ERROR');
      setLoading(false);
    } finally {
      setshouldRefresh(false);
    }
  };

  //Load more Function call from api
  const getFetchDataLoadMore = async (
    currentPage: any,
    loader: boolean = true,
  ) => {
    loader && setLoading(true);
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/posts',
        {
          params: {
            _page: currentPage,
            _limit: 10,
          },
        },
      );

      const totalCount = parseInt(response.headers['x-total-count'], 10);
      const lastPage = Math.ceil(totalCount / 10);
      if (currentPage === 1) {
        setData(response.data);
      } else {
        setData(prevData => [...prevData, ...response.data]);
      }

      // Update pagination refs
      pagination.current.currentPage = currentPage + 1;
      pagination.current.lastPage = lastPage;
      pagination.current.loader = false;
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
      setPaginationLoader(false);
    }
  };
  const increment = useCallback(() => setCounter(prev => prev + 1), []);
  const decrement = useCallback(() => setCounter(prev => prev - 1), []);

  //render FlatList Item
  const renderItem = useCallback(({item}: {item: any; index: any}) => {
    return <ListTab items={item} tabClick={onItemClick} />;
  }, []);

  //Function to navigate to detail screen
  const onItemClick = (id: number) => {
    props.navigation.navigate('DetailsScreen', {
      itemId: id,
    });
  };

  //load more fun call for fetch data
  const loadMoreData = () => {
    pagination.current.loader = true;
    setPaginationLoader(true);
    getFetchDataLoadMore(pagination.current.currentPage, false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={decrement} style={styles.redContainer}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>Counter: {counter}</Text>
        <TouchableOpacity onPress={increment} style={styles.redContainer}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      {!loading ? (
        <View style={styles.mainContainer}>
          <FlatList
            data={data}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            // initialNumToRender={10}
            // maxToRenderPerBatch={10}
            onEndReachedThreshold={0.5}
            onEndReached={loadMoreData}
            ListFooterComponent={() => {
              return (
                paginationLoader &&
                !loading && (
                  <ActivityIndicator size="large" style={{marginTop: 5}} />
                )
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={shouldRefresh}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={{paddingBottom: 10}}
          />
        </View>
      ) : (
        <ActivityIndicator size="large" />
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  mainContainer: {
    flex: 1,
    padding: 10,
    paddingBottom: 5,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  item: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    borderRadius: 10,
  },
  textIdStyle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleStyle: {
    color: 'black',
    fontSize: 14,
  },
  redContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    height: 30,
    width: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});
