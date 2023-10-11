import {
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import {View, Text, Icon} from 'react-native-ui-lib';
import React, {useEffect} from 'react';
import {FullButton, Navbar} from '@/components';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
import {selectPhotoTapped} from '@/components/ImagePickUpload/photoCamera';
import {formatUrl} from '@/utils/common';
import {addRealName, getRealNameInfo} from '@/api/userCenter';
import {Toast} from '@ant-design/react-native';
import _ from 'lodash';

export default function RealName({navigation}: {navigation: any}) {
  const {t} = useTranslation();

  const [form, setForm] = React.useState<any>({
    real_name: '',
    id_no: '',
    id_front_img: '',
    id_back_img: '',
  });

  const [real_auth, setReal_auth] = React.useState<any>(0);

  const initRealNameInfo = () => {
    getRealNameInfo({
      operation_id: new Date().getTime().toString(),
    }).then((res: any) => {
      switch (res.is_real_auth) {
        case 2:
          navigation.replace('operatorExamine', {
            realName: true,
          });
          break;
        case 3:
          setReal_auth(3);
          setForm({
            real_name: res.real_name,
            id_no: res.id_no,
            id_front_img: res.id_front_img,
            id_back_img: res.id_back_img,
          }); //清空表单
          break;
        case 4:
          setReal_auth(4);
          break;
      }
    });
  };

  //初始化获取信息
  useEffect(() => {
    initRealNameInfo();
  }, []);

  const submitRealName = () => {
    if (real_auth === 3) return;
    const {real_name, id_no, id_front_img, id_back_img} = form;
    if (!real_name) {
      Toast.info('请输入真实姓名');
      return;
    }
    if (!id_no) {
      Toast.info('请输入身份证号码');
      return;
    }
    if (!/^\d{17}(\d|x)$/i.test(id_no)) {
      Toast.info('请输入正确的身份证号码');
      return;
    }
    if (!id_front_img) {
      Toast.info('请上传身份证正面');
      return;
    }
    if (!id_back_img) {
      Toast.info('请上传身份证反面');
      return;
    }
    addRealName({
      ...form,
      operation_id: new Date().getTime().toString(),
    }).then((res: any) => {
      // Toast.info('提交成功');
      navigation.replace('operatorExamine', {
        realName: true,
      });
    });
  };

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}>
      <Navbar title="实名认证" />
      {real_auth === 4 ? (
        <View row centerV style={styles.tips}>
          <Icon assetName="location" assetGroup="icons.app"></Icon>
          <Text style={styles.tipsError}>
            {t('审核已被拒绝，请重新提交材料')}
          </Text>
        </View>
      ) : real_auth === 3 ? (
        <View row centerV style={styles.tips}>
          <Icon assetName="location" assetGroup="icons.app"></Icon>
          <Text style={styles.tipsTxt}>{t('实名认证已审核通过')}</Text>
        </View>
      ) : (
        <View row centerV style={styles.tips}>
          <Icon assetName="location" assetGroup="icons.app"></Icon>
          <Text style={styles.tipsTxt}>
            {t('确保提交材料真实有效，否则将无法完成申请')}
          </Text>
        </View>
      )}
      <ScrollView
        style={{
          backgroundColor: '#fff',
        }}>
        <View style={styles.container}>
          <View style={{marginBottom: pt(0)}}>
            <Text style={styles.title}>{t('真实姓名')}</Text>
            <TextInput
              value={form.real_name}
              editable={real_auth !== 3}
              onChangeText={(name: any) =>
                setForm({
                  ...form,
                  real_name: name,
                })
              }
              style={styles.remark}
              placeholder={t('请输入真实姓名')}></TextInput>
          </View>
          <View style={{marginBottom: pt(0)}}>
            <Text style={styles.title}>{t('身份证号码')}</Text>
            <TextInput
              value={form.id_no}
              editable={real_auth !== 3}
              onChangeText={(val: any) =>
                setForm({
                  ...form,
                  id_no: val,
                })
              }
              style={styles.remark}
              placeholder={t('请输入身份证号码')}></TextInput>
          </View>
          <View style={{}}>
            <Text style={styles.title}>身份证正面</Text>
            <TouchableOpacity
              onPress={() => {
                if (real_auth === 3) return;
                selectPhotoTapped(true, {selectionLimit: 1}).then(
                  (res: any) => {
                    setForm({
                      ...form,
                      id_front_img: formatUrl(res[0].url),
                    });
                  },
                );
              }}
              activeOpacity={1}
              style={styles.selectImg}>
              <View>
                {form.id_front_img ? (
                  <Image
                    resizeMode="contain"
                    style={{
                      width: pt(320),
                      height: pt(150),
                    }}
                    source={{uri: form.id_front_img}}></Image>
                ) : (
                  <>
                    <View row centerH>
                      <Icon
                        size={24}
                        assetName="add_active"
                        assetGroup="icons.app"></Icon>
                    </View>
                    <Text style={styles.selectTxt}>{t('身份证正面')}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Text style={styles.title}>身份证反面</Text>
            <TouchableOpacity
              onPress={() => {
                if (real_auth === 3) return;
                selectPhotoTapped(true, {selectionLimit: 1}).then(
                  (res: any) => {
                    setForm({
                      ...form,
                      id_back_img: formatUrl(res[0].url),
                    });
                  },
                );
              }}
              activeOpacity={1}
              style={styles.selectImg}>
              <View>
                {form.id_back_img ? (
                  <Image
                    resizeMode="contain"
                    style={{
                      width: pt(320),
                      height: pt(150),
                    }}
                    source={{uri: form.id_back_img}}></Image>
                ) : (
                  <>
                    <View row centerH>
                      <Icon
                        size={24}
                        assetName="add_active"
                        assetGroup="icons.app"></Icon>
                    </View>
                    <Text style={styles.selectTxt}>{t('身份证反面')}</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <FullButton
        style={{marginTop: pt(20)}}
        disabled={real_auth === 3}
        text="提交"
        onPress={_.debounce(submitRealName)}
      />
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
  tipsError: {
    color: '#FF5000',
    fontSize: pt(12),
    marginLeft: pt(12),
  },
  container: {
    backgroundColor: '#fff',
    marginLeft: pt(20),
    marginRight: pt(20),
  },
  remark: {
    paddingBottom: pt(16),
    borderBottomColor: 'rgba(191, 191, 191, 0.2)',
    borderBottomWidth: pt(1),
    marginTop: pt(18),
  },

  title: {
    color: '#333333',
    fontSize: pt(15),
    marginTop: pt(16),
    fontWeight: '500',
  },

  selectImg: {
    height: pt(150),
    backgroundColor: '#F7F8FC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pt(14),
    borderRadius: pt(8),
  },
  selectTxt: {
    color: '#7581FF',
    fontSize: pt(12),
    marginTop: pt(10),
  },
});
