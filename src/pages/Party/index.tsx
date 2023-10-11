import {StyleSheet, Dimensions, FlatList} from 'react-native';
import {
  View,
  Text,
  TextField,
  Colors,
  Image,
  Icon,
  TouchableOpacity,
} from 'react-native-ui-lib';
import React, {useEffect, useRef, useState} from 'react';
// import MapView, {Marker} from 'react-native-maps';
import {AMapSdk, MapView, MapType, Cluster, Marker} from 'react-native-amap3d';
import {Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {pt} from '@/utils/dimension';
import {shoppingList} from '@/api/shopping';
import * as toast from '@/utils/toast';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SvgIcon} from '@/components';
import {coordinateConvert, getGeocodeRegeo} from '@/api/amap';
import _ from 'lodash';
import LoadFooter from '@/components/loadFooter';

AMapSdk.init(
  Platform.select({
    android: 'be9a4fd241fe6e650fda7e5b3c54fe19',
    ios: 'a523c2d3a163d83ccac0e44677a4213f',
  }),
);
export default function PartyIndex(props: any) {
  const {navigation} = props;
  const [location, setLocation] = useState<any>({
    latitude: 39.56,
    longitude: 116.2,
  });
  const mapViewRef = useRef<MapView>(null);
  const [hasPermission, setPermission] = useState(true);
  const [addRess, changeAddress] = useState('');
  const [cityCode, setCityCode] = useState();
  const [loading, setLoading] = useState(false);
  const [isEnd, changeEndStatus] = useState(false);
  const [isSearch, setSearchStatus] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [list, setList] = useState([]);
  const [key, setKeywords] = useState('');
  const insets = useSafeAreaInsets();
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position: any) => {
        const {coords} = position;
        const params = {
          locations: `${coords.longitude},${coords.latitude}`,
          coordsys: 'gps',
        };
        coordinateConvert(params).then((res: any) => {
          setLocation({
            latitude: res.locations?.split(',')[1],
            longitude: res.locations?.split(',')[0],
          });
        });
      },
      err => {
        setPermission(false);
        // toast.error(err.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);
  //获取地理位置
  const getLocationAddress = () => {
    const params = {
      location:
        location.longitude && location.latitude
          ? `${location.longitude},${location.latitude}`
          : '',
      radius: 50,
      extensions: 'all',
    };
    getGeocodeRegeo(params).then((res: any) => {
      console.log('获取地理位置', res, '获取地理位置');
      setCityCode(res.regeocode.addressComponent.citycode);
      // changeAddress(
      //   `${res.regeocode.addressComponent.city}${
      //     res.regeocode.addressComponent.district
      //   }${res.regeocode.addressComponent.township}${
      //     res.regeocode.pois[0]?.address || ''
      //   }`,
      // );
      changeAddress(`${res.regeocode.formatted_address}`);
    });
  };
  const getList = () => {
    const params = {
      // city_code: cityCode,
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      operation_id: new Date().getTime().toString(),
      key,
      page: 1,
      page_size: 10,
    };
    setLoading(true);
    setSearchStatus(false);
    shoppingList(params)
      .then((res: any) => {
        const listArr =
          res?.list?.map((item: any) => {
            return {
              position: {latitude: item.latitude, longitude: item.longitude},
              ...item,
            };
          }) || [];
        const newList = list.concat(listArr || []);
        if (newList.length >= res.count) {
          changeEndStatus(true);
        }
        setList(newList);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (hasPermission) {
      getLocationAddress();
    }
  }, [location.latitude]);
  //得到经纬度或者无权限定位时获取加盟商
  useEffect(() => {
    if (hasPermission || isSearch) {
      getList();
    }
  }, [location.latitude, hasPermission, isSearch]);

  const handleLoadMore = () => {
    if (!loading && !isEnd) {
      // 避免在上一个请求完成前重复请求
      setPagination({
        current: pagination.current + 1,
        pageSize: pagination.pageSize,
        total: pagination.total,
      });
      getList();
    }
  };
  //搜索数据
  const handleSearch = () => {
    setList([]);
    setPagination({
      total: 0,
      current: 1,
      pageSize: pagination.pageSize,
    });
    setSearchStatus(true);
  };

  const renderItem = (data: any) => {
    const {item} = data;
    const shop_distance = `${parseFloat(item?.shop_distance).toFixed(2)}km`;
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          navigation.navigate({
            name: 'franchiseeDetail',
            params: {shop_id: item?.shop_id},
          });
        }}
        row
        center
        style={styles.positionItem}>
        <Image
          style={{width: pt(49), height: pt(49)}}
          source={{uri: item?.shop_icon[0]}}></Image>
        <View
          style={{
            flex: 1,
            marginLeft: pt(15),
          }}>
          <Text style={{color: '#222', fontSize: pt(16), fontWeight: 'bold'}}>
            {item?.shop_name}
          </Text>
          <View row style={{marginTop: pt(8)}}>
            <View row centerV style={{flex: 1, marginRight: pt(20)}}>
              <Text style={styles.itemTxt}>{item?.shop_type || '未知'}</Text>
              <Text
                numberOfLines={1}
                style={{...styles.itemTxt, marginLeft: pt(15)}}>
                {item?.shop_location}
              </Text>
            </View>
            <View row centerV centerH style={{width: pt(80)}}>
              <Icon assetGroup="icons.app" assetName="maps_location"></Icon>
              <Text style={{...styles.itemTxt, marginLeft: pt(6)}}>
                {shop_distance}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.party}>
      <View
        style={{
          position: 'absolute',
          top: insets.top,
          width: '100%',
          height: insets.top,
          zIndex: 999,
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.navBack}
          onPress={() => {
            navigation.goBack();
          }}>
          <SvgIcon
            name="navBack"
            size={22}
            style={{
              width: pt(10),
              height: pt(16),
            }}
          />
        </TouchableOpacity>
      </View>
      <MapView
        mapType={MapType.Standard}
        style={styles.map}
        compassEnabled={false}
        myLocationEnabled={true}
        onLoad={() =>
          mapViewRef.current?.moveCamera(
            {
              zoom: 14,
              target: {
                latitude: parseFloat(parseFloat(location.latitude).toFixed(5)),
                longitude: parseFloat(
                  parseFloat(location.longitude).toFixed(5),
                ),
              },
            },
            100,
          )
        }
        ref={mapViewRef}
        onLocation={({nativeEvent}) => {
          console.log('地图定位更新===>', nativeEvent);
        }}>
        {/* <Cluster
          points={list}
          renderMarker={item => (
            <Marker key={item?.shop_id} position={item.position}>
              <View style={styles.mapsMarker}>
                <Icon assetGroup="page.friends" assetName="shop"></Icon>
                <Text numberOfLines={1} style={styles.mapsMarkerText}>
                  {item?.shop_name}
                </Text>
              </View>
            </Marker>
          )}
        /> */}
      </MapView>

      {/* <MapView
        style={styles.map}
        showsUserLocation={true}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.00922 * 1.2,
          longitudeDelta: 0.00421 * 1.2,
        }}>
        {_.map(list, (marker: any, index) => {
          const latlng = {
            latitude: marker?.latitude || 0,
            longitude: marker?.longitude || 0,
          };

          return (
            <Marker key={index} coordinate={latlng}>
              <View style={styles.mapsMarker}>
                <Icon assetGroup="page.friends" assetName="shop"></Icon>
                <Text numberOfLines={1} style={styles.mapsMarkerText}>
                  {marker?.shop_name}
                </Text>
              </View>
            </Marker>
          );
        })}
      </MapView> */}
      <View style={styles.partySeach}>
        <View style={styles.searchContent}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Icon assetGroup="icons.app" assetName="maps_search"></Icon>
            <TextField
              onChangeText={value => setKeywords(value)}
              style={styles.searchInput}
              placeholder="请输入你需要搜索的内容"></TextField>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              handleSearch();
            }}>
            <Text style={styles.searchBtn}>搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.location}>
          <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Icon assetGroup="icons.app" assetName="maps_position"></Icon>
            <Text style={styles.positionTxt}>
              {hasPermission ? addRess : '请在设置中找到当前APP打开定位'}
            </Text>
          </View>
          <Icon assetGroup="icons.app" assetName="next_smail"></Icon>
        </View>

        <FlatList
          data={list}
          renderItem={renderItem}
          onEndReached={handleLoadMore}
          ListFooterComponent={
            <LoadFooter loading={loading} isEnd={isEnd}></LoadFooter>
          }
          keyExtractor={(item: any, index) => index.toString()}></FlatList>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  party: {
    position: 'relative',
    height: '100%',
  },
  map: {
    position: 'absolute',
    height: '50%',
    width: '100%',
  },
  partySeach: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.5,
    height: Dimensions.get('window').height * 0.5,
    width: '100%',
    backgroundColor: '#fff',
  },
  searchContent: {
    marginTop: pt(-20),
    marginLeft: pt(16),
    marginRight: pt(16),
    height: pt(50),
    backgroundColor: Colors.white,
    borderWidth: pt(1),
    borderColor: '#EAEAF4',
    elevation: 1.5,
    shadowColor: Colors.color999,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderRadius: pt(13),
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: pt(10),
    paddingRight: pt(10),
  },
  searchInput: {
    marginLeft: pt(10),
  },
  searchBtn: {
    color: '#7581FF',
    fontWeight: 'bold',
  },
  location: {
    margin: pt(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionTxt: {
    color: '#4B4B4B',
    marginLeft: pt(8),
  },
  positionItem: {
    padding: pt(13),
    margin: pt(16),
    marginTop: pt(5),
    elevation: 1.5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    backgroundColor: Colors.white,
    borderRadius: pt(10),
  },
  itemTxt: {
    color: '#666666',
    fontSize: pt(12),
  },
  header: {
    position: 'absolute',
    zIndex: 999,
    top: 0,
  },
  navBack: {
    paddingHorizontal: pt(16),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  mapsMarker: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapsMarkerText: {
    position: 'absolute',
    width: pt(90),
    paddingLeft: pt(5),
    paddingRight: pt(5),
    height: pt(30),
    lineHeight: pt(30),
    backgroundColor: '#fff',
    top: pt(-35),
    textAlign: 'center',
    borderRadius: pt(4),
    overflow: 'hidden',
  },
});
