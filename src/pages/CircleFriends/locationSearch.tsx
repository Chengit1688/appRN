import {Text, ScrollView, StyleSheet, FlatList} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Colors,
  Icon,
  TouchableOpacity,
  LoaderScreen,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import SearchInput from '@/components/SearchInput';
import {getAroundAddress} from '@/api/amap';
import Geolocation from 'react-native-geolocation-service';
import * as toast from '@/utils/toast';
import _ from 'lodash';
import {usePagination} from 'ahooks';
import {useTranslation} from 'react-i18next';
import Header from '@/components/Header';

import {useDispatch} from 'react-redux';
import {AppDispatch} from '@/store';
import {setLocationInfo} from '@/store/actions/circle';
import {useNavigation} from '@react-navigation/native';
import {Navbar} from '@/components';

export default function LocationSearch() {
  const dispatch: AppDispatch = useDispatch();
  const {goBack, navigate} = useNavigation();
  const {t} = useTranslation();
  const [list, setList] = useState<any>([]);
  const [keywords, setKeyWord] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [hasPermission, setPermission] = useState(true);
  const [showSearch, changeSearch] = useState(false);
  const [noLocation, changenoLocation] = useState(false);
  const [loadFalg, changeLoadFalg] = useState(false);
  const [isSearchInit, changeSearchInit] = useState(true);

  const [locationInfo, setLocationInfo] = useState({
    name: '',
    address: '',
  });

  const listRef = useRef<any>();

  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [pagination, setPagination] = useState({
    page_num: 1,
    page_size: 20,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      err => {
        setPermission(false);
        //toast.error(err.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);
  useEffect(() => {
    if (location.latitude != 0 || !isSearchInit) {
      getList();
    }
  }, [location.latitude, keywords]);

  const getList = () => {
    if (loading) return;
    setLoading(true);
    const params = {
      location:
        location.longitude && location.latitude
          ? `${location.longitude},${location.latitude}`
          : '',
      keywords,
      ...pagination,
    };

    try {
      getAroundAddress(params)
        .then((res: any) => {
          if (res?.infocode === '10000') {
            let newList: any = [];

            if (pagination.page_num === 1 && !keywords) {
              newList = [{name: res.pois[1].cityname}].concat(res.pois);
            } else {
              newList = list.concat(res.pois);
            }
            setList(newList);
          } else {
            toast.error('地图API服务异常，请重试');
          }
        })
        .finally(() => {
          setLoading(false);
        });

      //   getAroundAddress(params).then((res:any)=>{
      //     if(res?.infocode === '10000'){
      //         setList(res.pois || [])
      //     }else{
      //         toast.error("地图API服务异常，请重试")
      //     }
      //   })
    } catch (e) {
      console.log(e);
    }
  };
  const headerRight = () => {
    const handleHeaderBtn = () => {
      navigate('publishFriends', {locationInfo});
    };

    return (
      <TouchableOpacity activeOpacity={1} onPress={handleHeaderBtn}>
        <Text style={styles.btns}>完成</Text>
        {/* {
                !showSearch ? <Icon assetGroup='icons.app' assetName="maps_search"></Icon> : <Text style={styles.btns}>完成</Text>
            } */}
      </TouchableOpacity>
    );
  };
  //选择位置
  const selectLocation = (noFalg = true, index?: any, reset = false) => {
    changenoLocation(false);
    const newData = _.map(list, (item, j) => {
      if (index === j) {
        item.checked = true;
        setLocationInfo({
          name: item.name,
          address: item.address,
        });
      } else {
        item.checked = false;
      }

      return item;
    });
    setList(newData);
    if (noFalg && !reset) {
      changenoLocation(true);
    }
  };

  //搜索
  const submitSearch = (value: string) => {
    changeSearchInit(false);
    selectLocation(true, -1, true);
    setList([]);
    setPagination({
      page_num: 1,
      page_size: 20,
    });

    listRef.current.scrollToOffset({animated: true, offset: 0});
    setKeyWord(value);
  };
  //  useEffect(()=>{
  //     if(!isSearchInit){
  //         getList()
  //     }
  //  },[keywords])

  //加载更多
  const handleOnEndReached = () => {
    const num = pagination.page_num + 1;
    setPagination({
      page_num: num,
      page_size: pagination.page_size,
    });
    getList();
  };

  const renderItem = (props: any) => {
    const {item, index} = props;
    const reg = new RegExp('(' + keywords + ')');
    const nameArr = item.name.split(reg);
    const addressArr = (item.address && item.address.split(reg)) || [];
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => selectLocation(false, index)}
        row
        centerV
        style={styles.item}>
        <View style={{flex: 1}}>
          <View row centerV>
            {_.map(nameArr, (titleItem, index) => {
              if (titleItem === keywords) {
                return (
                  <Text key={index} style={[styles.fz16333, styles.keyWord]}>
                    {titleItem}
                  </Text>
                );
              } else {
                return (
                  <Text key={index} style={[styles.fz16333]}>
                    {titleItem}
                  </Text>
                );
              }
            })}
          </View>
          {item.address ? (
            <Text numberOfLines={1}>
              {_.map(addressArr, (addItem, index) => {
                if (addItem === keywords) {
                  return (
                    <Text key={index} style={[styles.txt, styles.keyWord]}>
                      {addItem}
                    </Text>
                  );
                } else {
                  return (
                    <Text key={index} style={[styles.txt]}>
                      {addItem}
                    </Text>
                  );
                }
              })}
            </Text>
          ) : null}
        </View>
        {item.checked ? (
          <Text style={[styles.radio, styles.checkRadio]}></Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Navbar title="所在位置" right={headerRight()} />
      <View
        style={{
          padding: pt(14),
          paddingTop: pt(0),
        }}>
        <SearchInput
          onSearch={(value: string) => {
            submitSearch(value);
          }}
          placeholder="搜索地址"
          style={{marginBottom: pt(10)}}></SearchInput>

        <TouchableOpacity
          activeOpacity={1}
          onPress={selectLocation}
          style={{...styles.flexRow, ...styles.item}}>
          <Text style={{...styles.fz16333, flex: 1}}>{t('不显示位置')}</Text>

          {noLocation ? (
            <Text style={[styles.radio, styles.checkRadio]}></Text>
          ) : null}
        </TouchableOpacity>

        {hasPermission ? (
          <FlatList
            ref={listRef}
            renderItem={renderItem}
            data={list}
            keyExtractor={(item, idx) => String(idx)}
            ListFooterComponent={() =>
              loading ? (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <LoaderScreen
                    messageStyle={{fontSize: pt(13)}}
                    size={30}
                    message={'加载中...'}
                    color={'#000'}
                  />
                </View>
              ) : null
            }
            onEndReachedThreshold={0.1}
            onEndReached={handleOnEndReached}></FlatList>
        ) : (
          <View
            style={{
              width: '100%',
              backgroundColor: '#fff',

              marginTop: pt(100),
            }}>
            <Text style={{textAlign: 'center', fontSize: pt(14)}}>
              无法获取您的位置信息
            </Text>
            <Text
              style={{textAlign: 'center', color: '#666', marginTop: pt(20)}}>
              请在设置APP中允许访问位置信息
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
  },
  item: {
    borderBottomColor: 'rgba(191,191,191,.2)',
    paddingTop: pt(10),
    paddingBottom: pt(10),
    borderBottomWidth: pt(1),
  },
  pb10: {
    padding: pt(18),
    paddingLeft: pt(0),
    paddingRight: pt(0),
  },
  mt10: {
    marginTop: pt(10),
  },
  ml10: {
    marginLeft: pt(10),
  },
  mt20: {
    marginTop: pt(20),
  },

  fz16333: {
    fontSize: pt(16),
    color: '#333333',
    fontWeight: '500',
  },
  keyWord: {
    color: '#7581FF',
  },
  txt: {
    fontSize: pt(13),
    color: '#666',
    marginTop: pt(5),
  },
  radio: {
    width: pt(16),
    height: pt(16),
    borderWidth: pt(1),
    borderRadius: pt(8),
    borderColor: '#BCBCBC',
  },
  checkRadio: {
    borderWidth: pt(5),
    borderColor: '#7581FE',
  },
  btns: {
    width: pt(60),
    height: pt(30),
    backgroundColor: '#7581FF',
    borderRadius: pt(4),
    color: '#fff',
    textAlign: 'center',
    lineHeight: pt(30),
    overflow: 'hidden',
    fontWeight: '500',
  },
});
