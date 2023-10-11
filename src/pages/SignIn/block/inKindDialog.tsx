import {
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  View,
  Text,
  Dialog,
  PanningProvider,
  TextField,
  Icon,
  Image,
} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import {exchangePrize} from '@/api/sign';
import {Toast} from '@ant-design/react-native';

export default function InKindDialog({
  type,
  setIsVisible,
  isVisible,
  details,
  handleRefresh,
}: {
  type: number;
  setIsVisible: (isVisible: boolean) => void;
  handleRefresh: () => void;
  isVisible: boolean;
  details: any;
}) {
  const {t} = useTranslation();
  console.log(details, 'awardDetails');
  const [form, setForm] = React.useState<any>({
    mobile: '',
    user_name: '',
    address: '',
    prize_id: details.id,
  });

  const handleExchange = () => {
    if (details.is_fictitious === 1) {
      if (!form.mobile) {
        Toast.info('请输入手机号码');
        return;
      }
    } else if (details.is_fictitious === 2) {
      if (!form.user_name) {
        Toast.info('请输入收货人姓名');
        return;
      }
      if (!form.mobile) {
        Toast.info('请输入联系电话');
        return;
      }
      if (!form.address) {
        Toast.info('请输入收货地址');
        return;
      }
    }
    exchangePrize({
      operation_id: new Date().getTime().toString(),
      ...form,
      prize_id: details.id,
    }).then(res => {
      setIsVisible(false);
      Toast.info('兑换成功');
      handleRefresh();
    });
  };

  const renderInkind = () => {
    const {t} = useTranslation();
    return (
      <>
        <Text style={styles.dialogTitle}>{t('实物兑换')}</Text>
        <View style={styles.dialogInput}>
          <Text style={{marginTop: pt(5), marginBottom: pt(10)}}>
            {t('收货人')}
          </Text>
          <TextInput
            onChangeText={(val: any) => {
              setForm({
                ...form,
                user_name: val,
              });
            }}
            placeholder={t('请输入收货人姓名')}></TextInput>
        </View>
        <View style={styles.dialogInput}>
          <Text style={{marginTop: pt(5), marginBottom: pt(10)}}>
            {t('联系电话')}
          </Text>
          <TextInput
            onChangeText={(val: any) => {
              setForm({
                ...form,
                mobile: val,
              });
            }}
            placeholder={t('请输入联系电话')}></TextInput>
        </View>
        <View style={styles.dialogInput}>
          <Text style={{marginTop: pt(5), marginBottom: pt(10)}}>
            {t('收货地址')}
          </Text>
          <TextInput
            onChangeText={(val: any) => {
              setForm({
                ...form,
                address: val,
              });
            }}
            placeholder={t('请输入收货地址')}></TextInput>
        </View>
        <View row style={{marginTop: pt(19)}}>
          <Text style={{color: '#FF5000'}}>*</Text>
          <Text style={{color: '#2D3351', fontSize: pt(12), marginLeft: pt(3)}}>
            {t('兑换后不予退还，请确认收货地址正确无误')}
          </Text>
        </View>
        <View style={styles.imgMain}>
          <Image
            style={{width: pt(70), height: pt(47)}}
            source={{
              uri: details.icon,
            }}></Image>
          <View style={{marginLeft: pt(10)}}>
            <Text style={{color: '#333', fontSize: pt(13)}}>
              {details.name}
            </Text>
            <Text style={{color: '#FF911C', marginTop: pt(5)}}>
              {' '}
              {details.cost / 100}金币
            </Text>
          </View>
        </View>
      </>
    );
  };

  const renderUnreal = () => {
    const {t} = useTranslation();
    return (
      <>
        <Text style={styles.dialogTitle}>{t('金币兑换')}</Text>

        <View style={styles.dialogInput}>
          <Text style={{marginTop: pt(5), marginBottom: pt(10)}}>
            {t('充值号码')}
          </Text>
          <TextInput
            onChangeText={(val: any) => {
              setForm({
                ...form,
                mobile: val,
              });
            }}
            placeholder={t('请输入充值号码')}></TextInput>
        </View>

        <View row style={{marginTop: pt(19)}}>
          <Text style={{color: '#FF5000'}}>*</Text>
          <Text style={{color: '#2D3351', fontSize: pt(12), marginLeft: pt(3)}}>
            {t('兑换后不予退还，请确认手机号码无误')}
          </Text>
        </View>
        <View style={styles.imgMain}>
          <ImageBackground
            style={{
              width: pt(70),
              height: pt(47),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            source={{uri: details.icon}}>
            {/* <Text style={{color: '#FF911C'}}>￥</Text>
            <Text style={{color: '#FF911C', fontSize: pt(27), fontWeight: '500'}}>
              30
            </Text> */}
          </ImageBackground>
          <View style={{marginLeft: pt(10)}}>
            <Text style={{color: '#333', fontSize: pt(13)}}>
              {details.name}
            </Text>
            <Text style={{color: '#FF911C', marginTop: pt(5)}}>
              {details.cost / 100}金币
            </Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <Dialog
      visible={isVisible}
      onDismiss={() => console.log('dismissed')}
      panDirection={PanningProvider.Directions.DOWN}>
      <View style={styles.dialogContent}>
        {type === 2 ? renderInkind() : renderUnreal()}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            handleExchange();
          }}>
          <Text style={styles.dialogBtn}>{t('确定')}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.close}>
        <Icon
          style={styles.closeIcon}
          size={32}
          assetName="add_btn"
          assetGroup="icons.app"></Icon>
      </TouchableOpacity>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogContent: {
    backgroundColor: '#fff',
    borderRadius: pt(10),
    padding: pt(20),
  },
  dialogTitle: {
    fontSize: pt(15),
    fontWeight: 'bold',
    color: '#333',
    marginBottom: pt(10),
  },
  dialogTips: {
    fontSize: pt(13),
    fontWeight: '500',
    color: '#999',
    marginBottom: pt(10),
  },
  dialogInput: {
    borderBottomColor: 'rgba(102, 102, 102, .1)',
    borderBottomWidth: pt(1),
    paddingBottom: pt(10),
    marginTop: pt(10),
  },
  inputTxt: {
    flex: 1,
  },
  dialogBtn: {
    height: pt(44),
    marginTop: pt(20),
    backgroundColor: '#7581FF',
    textAlign: 'center',
    lineHeight: pt(44),
    color: '#fff',
    borderRadius: pt(8),
    overflow: 'hidden',
    fontSize: pt(15),
    fontWeight: 'bold',
  },
  close: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pt(20),
  },
  closeIcon: {
    transform: [{rotate: '45deg'}],
  },
  imgMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: pt(13),
    elevation: 3,
    shadowColor: 'rgb(108,124,149)',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#fff',
    marginTop: pt(10),
    borderRadius: pt(5),
  },
});
