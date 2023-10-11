import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextField,
} from 'react-native-ui-lib';
import React, {useEffect, useState} from 'react';
import {Dimensions, FlatList, ScrollView} from 'react-native';
import {useTranslation} from 'react-i18next';
import FullButton from '@/components/FullButton';
import {pt} from '@/utils/dimension';
import Navbar from '@/components/Navbar';
import HeaderRight from '@/components/HeaderRight/button';
import {Popup} from '@/components';
import {joinTeam, getTeamMemeberInfo} from '@/api/operator';
import * as toast from '@/utils/toast';
import _ from 'lodash';
import {useRoute} from '@react-navigation/native';
import {shallowEqual, useSelector} from 'react-redux';

export default function OperatorIndex(props: any) {
  const {navigation} = props;
  const {params} = useRoute<any>();
  const {t} = useTranslation();
  const [joinVisible, setJoinVisible] = useState(false);
  const [invite_code, setInviteCode] = useState('');

  const selfInfo = useSelector(
    (state: any) => state.user.selfInfo,
    shallowEqual,
  );

  useEffect(() => {
    if (params?.source && params?.source === 'qrcode') {
      //扫码跳转过来，加入团队
      setJoinVisible(true);
      setInviteCode(params?.invite_code || '');
    } else {
      //获取个人信息
      getTeamMemeberInfo({
        operation_id: new Date().getTime().toString(),
        user_id: selfInfo.user_id,
      }).then((res: any) => {
        if (res.role === 0 && res.shop_status === 0) {
          //当前用户既没有加入团队，也没有加盟商
          return;
        } else if (res.shop_status === 1) {
          navigation.replace('operatorExamine');
        } else {
          navigation.replace('operatorDetail', {shop_id: res.shop_id});
        }
      });
    }
  }, [params]);

  const renderItem = (datas: any) => {
    const {item} = datas;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('franchiseeDetail');
        }}
        row
        center
        style={{
          paddingBottom: pt(15),
          borderBottomColor: 'rgba(191, 191, 191, 0.2)',
          borderBottomWidth: pt(0.5),
          paddingTop: pt(15),
        }}>
        <Image
          style={{width: pt(49), height: pt(49)}}
          source={{uri: item.logo}}></Image>
        <View
          style={{
            flex: 1,
            marginLeft: pt(15),
          }}>
          <Text style={{color: '#222', fontSize: pt(16), fontWeight: 'bold'}}>
            {item.name}
          </Text>
          <Text style={{color: '#959595', fontSize: pt(13), marginTop: pt(5)}}>
            {item.desc}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleJoinTeam = () => {
    if (!invite_code) {
      toast.error(t('请输入团队邀请码'));
      return false;
    }
    const params = {
      invite_code,
      operation_id: new Date().getTime().toString(),
    };
    joinTeam(params).then((res: any) => {
      navigation.replace('operatorDetail', {shop_id: res.shop_id});
    });
  };
  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}>
      <Navbar
        title={'运营商'}
        right={
          <HeaderRight
            onPress={() => {
              setJoinVisible(true);
            }}
            text="加入团队"></HeaderRight>
        }></Navbar>
      <View
        style={{
          backgroundColor: '#fff',
          position: 'relative',
        }}>
        {/* {
                data.length > 0 ?  
                <FlatList 
                    style={{ padding: pt(20)}} 
                    data={data} 
                    renderItem={renderItem}></FlatList> :
            } */}

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: pt(100),
          }}>
          <Image assetName="empty" assetGroup="imgs.app" />
          <Text style={{color: '#666666'}}>{t('暂无数据')}</Text>
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: pt(20),
          width: '100%',
        }}>
        <FullButton
          text={t('成为运营商')}
          onPress={() => {
            navigation.navigate({name: 'operatoApplyJoin'});
          }}></FullButton>
      </View>
      <Popup
        visible={joinVisible}
        onDismiss={() => {
          setJoinVisible(false);
        }}>
        <View
          style={{
            borderRadius: pt(10),
            backgroundColor: '#fff',
            padding: pt(15),
            width: pt(300),
          }}>
          <View
            style={{
              borderBottomColor: 'rgba(102, 102, 102, .1)',
              borderBottomWidth: pt(1),
              paddingBottom: pt(10),
              marginTop: pt(10),
            }}>
            <Text
              style={{
                fontSize: pt(15),
                color: '#000',
                marginBottom: pt(20),
              }}>
              {t('请输入团队邀请码')}
            </Text>
            <TextField
              value={invite_code}
              onChangeText={(value: string) => {
                setInviteCode(value);
              }}
              placeholder={t('邀请码')}></TextField>
          </View>
          <FullButton
            onPress={() => {
              handleJoinTeam();
            }}
            text={t('发送')}
            style={{
              width: pt(270),
              marginLeft: 0,
              marginTop: pt(20),
              marginBottom: pt(0),
              marginRight: 0,
            }}
          />
        </View>
      </Popup>
    </View>
  );
}
