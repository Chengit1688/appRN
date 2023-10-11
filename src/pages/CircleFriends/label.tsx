import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Modal, Toast} from '@ant-design/react-native';
import {Colors, ListItem, RadioButton, Drawer} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import _ from 'lodash';
import {useTranslation} from 'react-i18next';
import FullButton from '@/components/FullButton';
import Loading from '@/components/Loading';
import {Navbar, Empty} from '@/components';
import {getTagList, delTag} from '@/api/label';
import {useLoadList} from '@/hooks';
import headerRight from '@/components/HeaderRight/button';

type item = {
  name: String;
  nums: Number;
};

export default function Label(props: any) {
  const {navigation, route} = props;
  const {params} = route;
  const showRadio = params?.source ? true : false; //是否显示单选按钮
  const isSingle = params?.isSingle || false;
  const {t} = useTranslation();
  const [selecteds, setSelecteds] = useState<any>({...params?.selecteds}); //选中的标签

  const {loading, list, pagination, haveMore} = useLoadList((_params: any) => {
    console.log('params', _params);

    return getTagList({
      ..._params,
      operation_id: `${Date.now()}`,
    });
  });

  const contentViewScroll = e => {
    var offsetY = e.nativeEvent.contentOffset.y;
    var contentSizeHeight = e.nativeEvent.contentSize.height;
    var oriageScrollHeight = e.nativeEvent.layoutMeasurement.height;

    if (offsetY + oriageScrollHeight >= contentSizeHeight) {
      if (!haveMore || loading) {
        return;
      }
      pagination.onChange(pagination.current + 1, 10);
    }
  };

  const handleSelect = (item: any) => {
    if (isSingle) {
      const data: any = {};
      data[`key_${item.tag_id}`] = {
        ...item,
        checked: true,
      };
      setSelecteds(data);
      return;
    }
    if (
      selecteds[`key_${item.tag_id}`] &&
      selecteds[`key_${item.tag_id}`].checked
    ) {
      delete selecteds[`key_${item.tag_id}`];
    } else {
      selecteds[`key_${item.tag_id}`] = {...item, checked: true};
    }
    setSelecteds({...selecteds});
  };

  const handlerNavigate = () => {
    if (isSingle) {
      DeviceEventEmitter.emit('selectTag', {selecteds});
      navigation.goBack();
      return;
    }
    navigation.navigate({name: params?.source, params: {tags: selecteds}});
  };

  useFocusEffect(
    React.useCallback(() => {
      pagination.onChange(1, 10);
    }, []),
  );

  return (
    <>
      <Navbar
        title="标签"
        right={
          showRadio
            ? headerRight({
                text: `${t('选择')}(${Object.keys(selecteds).length})`,
                onPress: () => {
                  handlerNavigate();
                },
              })
            : ''
        }
      />
      <ScrollView
        style={{
          backgroundColor: Colors.white,
        }}
        onMomentumScrollEnd={contentViewScroll}>
        {!loading && !haveMore && !list.length && (
          <View
            style={{
              height: pt(400),
            }}>
            <Empty />
          </View>
        )}
        {loading && !list.length && <Loading />}
        <View
          style={{
            minHeight: Dimensions.get('screen').height,
          }}>
          {_.map(list, (item: any, index) => {
            return (
              <Drawer
                rightItems={[
                  {
                    text: t('删除'),
                    background: Colors.red30,
                    onPress: () => {
                      if (item.user_total !== 0) {
                        Toast.info('标签下存在成员，不可删除');
                        return;
                      }
                      Modal.alert(t('提示'), t('是否删除此标签'), [
                        {
                          text: '取消',
                          onPress: () => {},
                        },
                        {
                          text: '删除',
                          onPress: () => {
                            delTag({
                              operation_id: `${Date.now()}`,
                              id: item.tag_id,
                            }).then(res => {
                              pagination.onChange(1, 10);
                              Toast.info('已删除');
                            });
                          },
                          style: {
                            color: Colors.red30,
                          },
                        },
                      ]);
                    },
                  },
                ]}>
                <ListItem
                  key={index}
                  style={{paddingTop: pt(10), backgroundColor: Colors.white}}
                  pressColor={Colors.grey60}
                  activeOpacity={1}
                  onPress={() => {
                    navigation.navigate({
                      name: 'createLabel',
                      params: {id: item.tag_id, title: item.title},
                    });
                  }}>
                  {showRadio ? (
                    <ListItem.Part left>
                      <View
                        style={{
                          marginLeft: pt(16),
                          marginRight: pt(12),
                        }}>
                        <RadioButton
                          selected={selecteds[`key_${item.tag_id}`]?.checked}
                          onPress={() => {
                            handleSelect(item);
                          }}
                          label={''}
                          size={20}
                          color={'#7581FE'}
                        />
                      </View>
                    </ListItem.Part>
                  ) : null}

                  <ListItem.Part
                    left
                    containerStyle={{
                      marginLeft: pt(15),
                    }}>
                    <Text style={styles.label}>{item.title.charAt(0)}</Text>
                  </ListItem.Part>
                  <ListItem.Part>
                    <View style={{marginLeft: pt(10)}}>
                      <Text style={styles.labelName}>{item.title}</Text>
                      <Text style={styles.labelNums}>{`${t('当前人数')}(${
                        item.user_total || 0
                      })`}</Text>
                    </View>
                  </ListItem.Part>
                </ListItem>
              </Drawer>
            );
          })}
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: pt(24),
        }}>
        <FullButton
          icon="add_btn"
          text="新建标签"
          style={{
            marginBottom: 0,
          }}
          onPress={() => {
            navigation.navigate({name: 'createLabel'});
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    width: pt(40),
    height: pt(40),
    borderRadius: pt(20),
    overflow: 'hidden',
    backgroundColor: '#7581FF',
    textAlign: 'center',
    color: '#fff',
    lineHeight: pt(40),
    fontSize: pt(18),
    fontWeight: 'bold',
  },
  labelName: {
    fontSize: pt(14),
    color: '#222',
    fontWeight: '500',
  },
  labelNums: {
    fontSize: pt(13),
    color: '#999',
    fontWeight: '400',
    marginTop: pt(5),
  },
});
