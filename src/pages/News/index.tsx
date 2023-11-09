import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import List from './block/list';
import {pt} from '@/utils/dimension';
import {getNewList} from '@/api/news';
import LoadFooter from '@/components/loadFooter';

const NewsTab = createMaterialTopTabNavigator();
function MyTabBar({state, descriptors, navigation}: any) {
  return (
    <View style={{height: pt(52)}}>
      <ScrollView
        pagingEnabled={true}
        alwaysBounceHorizontal={true}
        horizontal={true}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            backgroundColor: '#fff',
            paddingRight: pt(20),
          }}>
          {state.routes.map(
            (route: {key: string | number; name: any}, index: any) => {
              const {options} = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;
              const isFocused = state.index === index;
              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
              return (
                <TouchableOpacity
                  style={styles.flexCol}
                  activeOpacity={1}
                  onPress={onPress}>
                  <Text
                    style={[styles.tabTitle, isFocused ? styles.active : null]}>
                    {label}
                  </Text>
                  {isFocused ? <Text style={styles.line}></Text> : null}
                </TouchableOpacity>
              );
            },
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default function News(props: any) {
  const {navigation} = props;
  const [listArr, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEnd, changeEndStatus] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 10,
  });

  const getList = () => {
    setLoading(true);
    getNewList({
      operation_id: Date.now().toString(),
      page: pagination?.current || 1,
      page_size: pagination?.pageSize || 10,
    })
      .then((res: any) => {
        // console.log('res=====>>>',res)
        const newArr = listArr.concat(res.list);

        if (newArr.length >= res.count) {
          changeEndStatus(true);
        }
        setList(newArr);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getList();
  }, [pagination.current]);

  const handleLoadMore = () => {
    if (!loading && !isEnd) {
      // 避免在上一个请求完成前重复请求
      setPagination({
        current: pagination.current + 1,
        pageSize: pagination.pageSize,
        total: pagination.total,
      });
    }
  };

  return (
    <FlatList
      style={{
        backgroundColor: '#fff',
        padding: pt(20),
        paddingTop: pt(5),
      }}
      onEndReached={handleLoadMore}
      ListFooterComponent={
        <LoadFooter loading={loading} isEnd={isEnd}></LoadFooter>
      }
      data={listArr}
      keyExtractor={(item: any, index) => String(item.id)}
      renderItem={({item}) => <List item={item} />}></FlatList>

    // 暂时不要，不知道后面要不要
    // <NewsTab.Navigator tabBar={(props) => <MyTabBar {...props} />}>
    //         <NewsTab.Screen
    //             name='recommend'
    //             options={{ title: '推荐'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //         <NewsTab.Screen
    //             name='new'
    //             options={{ title: '最新'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //         <NewsTab.Screen
    //             name='hot'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //          <NewsTab.Screen
    //             name='hot1'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //          <NewsTab.Screen
    //             name='hot2'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //          <NewsTab.Screen
    //             name='hot3'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //          <NewsTab.Screen
    //             name='hot4'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //          <NewsTab.Screen
    //             name='hot5'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //          <NewsTab.Screen
    //             name='hot6'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //          <NewsTab.Screen
    //             name='hot7'
    //             options={{ title: '最热'}}
    //             component={List}
    //         ></NewsTab.Screen>
    //     </NewsTab.Navigator>
  );
}

const styles = StyleSheet.create({
  flexCol: {
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',

    marginLeft: pt(20),
    backgroundColor: '#fff',
  },
  tabTitle: {
    fontSize: pt(15),
    color: '#B5B7BB',
    paddingBottom: pt(5),
  },
  active: {
    color: '#333',
    fontSize: pt(17),
    fontWeight: 'bold',
    borderBottomWidth: pt(1),
    borderBottomColor: '#7581FF',
  },
  line: {
    width: pt(11),
    height: pt(2),
    backgroundColor: '#7581FF',
    textAlign: 'center',
  },
});
