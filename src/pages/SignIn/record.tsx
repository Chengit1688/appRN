import {StyleSheet, ImageBackground, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import {useTranslation} from 'react-i18next';
import {getPrizeRecord} from '@/api/sign';
import {Toast} from '@ant-design/react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {
  Dialog,
  View,
  Text,
  PanningProvider,
  Incubator,
  TextField,
  TouchableOpacity,
  Icon,
} from 'react-native-ui-lib';
import {Navbar} from '@/components';
import LoadFooter from '@/components/loadFooter';
import {TextInput} from 'react-native-gesture-handler';

const btnTxtList = [
  {
    value: 1,
    label: '充值中',
  },
  {
    value: 2,
    label: '已到账',
  },
  {
    value: 21,
    label: '待出库',
  },
  {
    value: 22,
    label: '快递单号',
  },
];

export default function Record() {
  const {t} = useTranslation();

  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isEnd, setEnd] = useState(false);

  const getPrizeRecordData = () => {
    getPrizeRecord({
      operation_id: new Date().getTime().toString(),
      page: pagination.page,
      page_size: pagination.page_size,
    }).then((res: any) => {
      console.log(res);
      const newList = res?.list.concat(list);
      if (newList.length >= res?.count) {
        setEnd(true);
      }
      setList(newList);
    });
  };

  const [visible, setVisible] = React.useState(false);
  const [expressNumber, setExpressNumber] = useState('123');

  const [pagination, setPagination] = React.useState({
    page: 1,
    page_size: 10,
    total: 0,
  });

  useEffect(() => {
    getPrizeRecordData();
  }, [pagination.page]);

  const handleLoadMore = () => {
    if (loading || isEnd) {
      return;
    }

    setPagination({
      ...pagination,
      page: pagination.page + 1,
    });
  };

  const renderItem = (data: any) => {
    const {item} = data;

    const btnTxt =
      btnTxtList.find(txtItem => txtItem.value === item.status)?.label || '';

    return (
      <View style={styles.listItem}>
        <ImageBackground
          style={{
            width: pt(70),
            height: pt(47),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          source={{uri: item.icon}}>
          {/* <Text style={{color: '#FF911C'}}>￥</Text>
          <Text style={{color: '#FF911C', fontSize: pt(27), fontWeight: '500'}}>
            30
          </Text> */}
        </ImageBackground>
        <View style={{flex: 1, marginLeft: pt(10)}}>
          <Text style={{color: '#333', fontWeight: '500'}}>{item.name}</Text>
          <Text style={{color: '#FF911C', marginTop: pt(5)}}>
            {item.cost / 100}金币
          </Text>
        </View>
        {item.status === 12 ? (
          <TouchableOpacity
            onPress={() => {
              setExpressNumber(item.express_number);
              setVisible(true);
            }}
            style={{
              padding: pt(8),
              borderRadius: pt(4),
              borderWidth: pt(0.5),
              borderColor: '#7581FF',
            }}>
            <Text style={{color: '#7581FF'}}>{btnTxt}</Text>
          </TouchableOpacity>
        ) : (
          <Text>{btnTxt}</Text>
        )}
      </View>
    );
  };

  return (
    <View>
      <Dialog
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}
        panDirection={PanningProvider.Directions.DOWN}>
        <View style={styles.dialogContent}>
          <Text style={styles.dialogTitle}>{t('快递单号')}</Text>
          <Text style={styles.dialogTips}>{t('请复制后前往菜鸟裹裹查询')}</Text>
          <View row style={styles.dialogInput}>
            <View style={{flex: 1}}>
              <TextInput
                value={expressNumber}
                placeholder="请输入或粘贴"></TextInput>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                try {
                  Clipboard.setString(expressNumber);
                  setVisible(false);
                  Toast.info('复制成功');
                } catch (err) {
                  setVisible(false);
                  Toast.info('复制失败');
                }
              }}>
              <Icon
                style={{width: pt(60)}}
                assetName="contacts_active"
                assetGroup="icons.tab"
                size={18}></Icon>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              setVisible(false);
            }}>
            <Text style={styles.dialogBtn}>确定</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.close}
          onPress={() => {
            setVisible(false);
          }}>
          <Icon
            style={styles.closeIcon}
            size={32}
            assetName="add_btn"
            assetGroup="icons.app"></Icon>
        </TouchableOpacity>
      </Dialog>
      <Navbar title={t('兑换记录')}></Navbar>
      <FlatList
        data={list}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        keyExtractor={(item, index) => String(index)}
        ListFooterComponent={
          <LoadFooter loading={loading} isEnd={isEnd}></LoadFooter>
        }
        style={{
          backgroundColor: '#fff',
          height: '100%',
          padding: pt(14),
          paddingTop: pt(10),
        }}></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    marginTop: pt(5),
    marginBottom: pt(5),
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    backgroundColor: '#fff',
    borderRadius: pt(5),
    padding: pt(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: pt(71),
    height: pt(28),
    backgroundColor: '#7581FF',
    borderRadius: pt(4),
  },
  btnTxt: {
    color: '#fff',
    textAlign: 'center',
    height: pt(28),
    lineHeight: pt(28),
  },
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
    alignItems: 'center',
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
});
