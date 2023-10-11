import {View, Text, Icon, TextField} from 'react-native-ui-lib';
import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {pt} from '@/utils/dimension';
import {useTranslation} from 'react-i18next';
import FullButton from '@/components/FullButton';

export default function EditInfo() {
  const {t} = useTranslation();
  return (
    <ScrollView
      style={{
        backgroundColor: '#fff',
      }}>
      <View style={{margin: pt(15), marginBottom: pt(0)}}>
        <Text style={styles.title}>{t('店面照片')}</Text>
        <TouchableOpacity style={styles.selectImg}>
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
      </View>
      <View style={{margin: pt(15), marginBottom: pt(0)}}>
        <Text style={styles.title}>{t('店铺名称')}</Text>
        <TextField
          style={styles.remark}
          placeholder={t('请输入店铺名称')}></TextField>
      </View>
      <View style={{margin: pt(15), marginBottom: pt(0)}}>
        <Text style={styles.title}>{t('店铺简介')}</Text>
        <TextField
          style={styles.remark}
          placeholder={t('请输入店铺简介')}></TextField>
      </View>
      <View style={{margin: pt(15), marginBottom: pt(0)}}>
        <Text style={styles.title}>{t('店铺地址')}</Text>
        <TextField
          style={styles.remark}
          placeholder={t('请输入店铺简介')}></TextField>
      </View>
      <FullButton
        style={{marginTop: pt(60)}}
        text="确认修改"
        onPress={() => {}}></FullButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    color: '#333333',
    fontSize: pt(15),
    marginTop: pt(16),
    fontWeight: 'bold',
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
});
