import {
  View,
  Text,
  Icon,
  TouchableOpacity,
  TextField,
  Image,
} from 'react-native-ui-lib';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet} from 'react-native';
import {pt} from '@/utils/dimension';
import FullButton from '@/components/FullButton';
import {launchImageLibrary} from 'react-native-image-picker';
import {handleUpload} from '@/components/ImagePickUpload';
import Geolocation from 'react-native-geolocation-service';
import {useNavigation, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import * as toast from '@/utils/toast';
import {applyFor, shoppingDetail, updateShopping} from '@/api/shopping';
import {coordinateConvert, getGeocodeRegeo} from '@/api/amap';
import Navbar from '@/components/Navbar';

type UploadType = 'business' | 'shop';

export default function UploadData(props: any) {
  const {goBack} = useNavigation();
  const {navigation} = props;
  const {params} = useRoute<any>();

  const {t} = useTranslation();
  const [remarks, setRemarks] = useState();
  const [addRess, changeAddress] = useState('');
  const [cityCode, setCityCode] = useState('');
  const [shopType, setShopType] = useState();
  const [title, setTitle] = useState('上传资料');
  const [isDetail, setIsDetail] = useState(false);
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [name, setName] = useState();
  const [imgs, changeImgList] = useState<any>({
    businessImg: [],
    shopImg: [],
  });
  useEffect(() => {
    if (params?.shop_id) {
      setTitle('修改资料');
      setIsDetail(true);
      //获取详情
      shoppingDetail({
        operation_id: new Date().getTime().toString(),
        shop_id: params.shop_id,
      }).then((res: any) => {
        //由于之前from是分开设置的，每个单独设置下
        const shopImg: {url: any}[] = [];
        _.map(res.image, (item, index) => {
          const obj = {
            url: item,
          };
          shopImg.push(obj);
        });
        const businessImg: {url: any}[] = [];
        res.license &&
          businessImg.push({
            url: res.license,
          });

        setShopType(res.shop_type);
        setLocation({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        setName(res.name);
        setRemarks(res.description);
        changeAddress(res.address);
        changeImgList({
          shopImg,
          businessImg,
        });
      });
    } else {
      Geolocation.getCurrentPosition(
        position => {
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
          // toast.error(err.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  }, [params]);

  //上传
  const handleUploadimg = (type: UploadType) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1500,
        maxHeight: 2000,
        quality: 0.6,
        includeBase64: true,
        selectionLimit:
          type === 'business'
            ? 1 - imgs.businessImg.length
            : 5 - imgs.shopImg.length,
      },
      response => {
        if (response.assets) {
          handleUpload(response.assets).then((res: any) => {
            changeImgList({
              businessImg:
                type === 'business'
                  ? imgs.businessImg?.concat(res)
                  : imgs.businessImg,
              shopImg:
                type === 'shop' ? imgs.shopImg?.concat(res) : imgs.shopImg,
            });
          });
        }
      },
    );
  };

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
      let cc = '';
      let addr = '';
      try {
        cc = res.regeocode.addressComponent.citycode;
        addr = `${res.regeocode.addressComponent.city}${res.regeocode.addressComponent.district}${res.regeocode.addressComponent.township}${res.regeocode.pois[0].address}`;
        setCityCode(cc.toString());
        changeAddress(addr.toString());
      } catch (e) {}
    });
  };
  useEffect(() => {
    if (location.latitude != 0 && !isDetail) {
      getLocationAddress();
    }
  }, [location.latitude]);

  //提交资料
  const handleSubmit = () => {
    if (!name) {
      toast.error('请填写店铺名字');
      return;
    }
    if (imgs.businessImg.length <= 0) {
      toast.error('请上传营业执照');
      return;
    }
    if (imgs.shopImg.length <= 0) {
      toast.error('请上传店面照片');
      return;
    }

    const _params = {
      longitude: location.longitude.toString(),
      latitude: location.latitude.toString(),
      address: addRess,
      shop_type: shopType,
      city_code: cityCode,
      image: imgs.shopImg.map((item: any) => item.url),
      license: imgs.businessImg.map((item: any) => item.url).join(),
      name,
      description: remarks,
      operation_id: new Date().getTime().toString(),
    };

    if (isDetail) {
      const detailPrams = {
        ..._params,
        shop_id: params.shop_id,
      };
      updateShopping(detailPrams).then(res => {
        goBack();
      });
    } else {
      applyFor(_params).then((res: any) => {
        navigation.replace('examine');
      });
    }
  };
  const deleteImg = (type: UploadType, index: number) => {
    if (type === 'business') {
      imgs.businessImg.splice(index, 1);
    } else {
      imgs.shopImg.splice(index, 1);
    }

    changeImgList({
      businessImg: imgs.businessImg,
      shopImg: imgs.shopImg,
    });
  };

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}>
      <Navbar title={title}></Navbar>
      <ScrollView
        style={{
          backgroundColor: '#fff',
        }}>
        <View row centerV style={styles.tips}>
          <Icon assetName="location" assetGroup="icons.app"></Icon>
          <Text style={styles.tipsTxt}>
            {t('确保提交材料真实有效，否则将无法完成申请')}
          </Text>
        </View>
        <View style={{margin: pt(15), marginBottom: pt(0)}}>
          <Text style={styles.title}>{t('店铺名称')}</Text>
          <TextField
            value={name}
            onChangeText={(name: any) => setName(name)}
            style={styles.remark}
            placeholder={t('请输入店铺名称')}></TextField>
        </View>
        <View style={{margin: pt(15), marginBottom: pt(0)}}>
          <Text style={styles.title}>{t('店铺类型')}</Text>
          <TextField
            value={shopType}
            onChangeText={(value: any) => setShopType(value)}
            style={styles.remark}
            placeholder={t('请输入店铺类型')}></TextField>
        </View>
        <View style={{margin: pt(15), marginBottom: pt(0)}}>
          <Text style={styles.title}>{t('店铺地址')}</Text>
          <TextField
            value={addRess}
            multiline
            onChangeText={(addres: any) => changeAddress(addres)}
            style={styles.remark}
            placeholder={t('请输入店铺地址')}></TextField>
        </View>

        <View style={{margin: pt(15), marginBottom: pt(0)}}>
          <Text style={styles.title}>{t('营业执照')}</Text>
          <View row style={{flexWrap: 'wrap'}}>
            {_.map(imgs.businessImg, (item: any, index: number) => (
              <View style={styles.imgMain} key={index}>
                <Image
                  resizeMode={'cover'}
                  source={{uri: item.url}}
                  style={styles.selectImg}></Image>
                <TouchableOpacity
                  style={styles.delicon}
                  onPress={() => {
                    deleteImg('business', index);
                  }}
                  activeOpacity={1}>
                  <Icon
                    assetName="del_red"
                    assetGroup="page.friends"
                    size={pt(20)}
                  />
                </TouchableOpacity>
              </View>
            ))}
            {imgs.businessImg.length < 1 ? (
              <TouchableOpacity
                onPress={() => {
                  handleUploadimg('business');
                }}
                activeOpacity={1}
                style={styles.selectImg}>
                <View>
                  <View row centerH>
                    <Icon
                      size={24}
                      assetName="add_active"
                      assetGroup="icons.app"></Icon>
                  </View>
                  <Text style={styles.selectTxt}>{t('添加图片')}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <View style={{margin: pt(15), marginBottom: pt(0)}}>
          <Text style={styles.title}>{t('店面照片')}</Text>
          <View row style={{flexWrap: 'wrap'}}>
            {_.map(imgs.shopImg, (item: any, index: number) => (
              <View style={styles.imgMain} key={index}>
                <Image
                  resizeMode={'cover'}
                  source={{uri: item.url}}
                  style={styles.selectImg}></Image>
                <TouchableOpacity
                  style={styles.delicon}
                  onPress={() => {
                    deleteImg('shop', index);
                  }}
                  activeOpacity={1}>
                  <Icon
                    assetName="del_red"
                    assetGroup="page.friends"
                    size={pt(20)}
                  />
                </TouchableOpacity>
              </View>
            ))}
            {imgs.shopImg.length < 5 ? (
              <TouchableOpacity
                onPress={() => {
                  handleUploadimg('shop');
                }}
                activeOpacity={1}
                style={styles.selectImg}>
                <View>
                  <View row centerH>
                    <Icon
                      size={24}
                      assetName="add_active"
                      assetGroup="icons.app"></Icon>
                  </View>
                  <Text style={styles.selectTxt}>{t('添加图片')}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={{margin: pt(15), marginBottom: pt(0)}}>
          <Text style={styles.title}>{t('店铺简介')}</Text>
          <TextField
            value={remarks}
            onChangeText={(remark: any) => setRemarks(remark)}
            style={styles.remark}
            placeholder={t('请输入备注')}></TextField>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerTips}>
          {t('提交成功后，我们将会在1-2个工作日内给您回复')}
        </Text>
        <FullButton
          text={isDetail ? '确认修改' : '立即申请'}
          onPress={() => {
            handleSubmit();
            //    navigation.navigate({name:'examine'})
          }}></FullButton>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  tips: {
    height: pt(30),
    lineHeight: pt(30),
    backgroundColor: 'rgba(117, 129, 255,.1)',
    paddingLeft: pt(12),
    paddingRight: pt(12),
  },
  tipsTxt: {
    color: '#7581FF',
    fontSize: pt(12),
    marginLeft: pt(12),
  },
  title: {
    color: '#333333',
    fontSize: pt(15),
    marginTop: pt(16),
    fontWeight: 'bold',
  },
  imgMain: {
    position: 'relative',
    width: pt(110),
    height: pt(110),
    marginRight: pt(18),
    marginBottom: pt(10),
  },
  delicon: {
    position: 'absolute',
    top: pt(7),
    right: pt(-10),
  },
  selectImg: {
    width: pt(110),
    height: pt(110),
    backgroundColor: '#F7F8FC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pt(14),
  },
  selectTxt: {
    color: '#7581FF',
    fontSize: pt(12),
    marginTop: pt(10),
  },
  remark: {
    paddingBottom: pt(16),
    borderBottomColor: 'rgba(191, 191, 191, 0.2)',
    borderBottomWidth: pt(1),
    marginTop: pt(18),
  },
  footer: {
    marginTop: pt(20),
  },
  footerTips: {
    textAlign: 'center',
    fontSize: pt(12),
    color: '#666666',
  },
});
