import React, {useState, useEffect, useMemo} from 'react';
import {View, Text, Colors, TouchableOpacity, Image} from 'react-native-ui-lib';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Modal as ModalFull,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useTranslation} from 'react-i18next';
import SearchInput from '@/components/SearchInput';
import {Empty, Navbar, ActionSheet} from '@/components';
import {pt} from '@/utils/dimension';
import {useDebounceFn} from 'ahooks';
import imsdk, {IMSDK} from '@/utils/IMSDK';
import ContactIndexList from '@/components/ContactIndexList';
import ContactItem from '@/components/ContactItem';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import dayjs from 'dayjs';
import {formatUrl} from '@/utils/common';
import {formatFileSize} from '@/utils/format';
import moment from 'moment';
import _, {set} from 'lodash-es';

interface MessageLabel {
  // 便于rc-virtual-list设置key
  client_msg_id: string;
  label?: string;
}

const DATA = [
  {
    id: 3,
    label: '图片',
  },
  {
    id: 5,
    label: '视频',
  },
  {
    id: 10,
    label: '链接',
  },
  {
    id: 6,
    label: '文件',
  },
];
const Months = dayjs.months();

export default function ChatRecords(props: any) {
  const {t} = useTranslation();
  const [searchVal, setSearchVal] = useState('');
  const {navigate} = props.navigation;

  const [currentId, setCurrentId] = useState(3);
  const [messageList, setMessageList] = useState<any[]>([]);
  const [forwardData, setForwardData] = useState<any>();

  const [isShow, setIsShow] = useState(false);

  const {run} = useDebounceFn(
    async keyword => {
      setMessageList([]);
      const r = await imsdk.comlink.searchCollectMessageByContent(
        keyword.trim(),
        currentId,
      );

      if (r?.data?.length) {
        let list = (r.data as IMSDK.Message[]).sort(
          (a, b) => b.send_time - a.send_time,
        );
        list = list.filter(msg => ![2, 3, -97, -99].includes(msg.status));
        setMessageList(list);
      }
    },
    {
      wait: 300,
    },
  );
  const [imgViewVisible, changeImgViewVisible] = useState(false);
  const [imgViewSrc, changeImgSrc] = useState('');
  const [initIndex, changeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoObj, changeVideoObj] = useState({
    videView: false,
    videoSrc: '',
    videoPasue: false,
  });
  const handleLoad = () => {
    setIsLoading(false);
  };

  // 预览图片
  const ImageView = () => {
    return (
      <ModalFull visible={imgViewVisible} transparent={true}>
        <ImageViewer
          loadingRender={() => {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator animating size="large" />
              </View>
            );
          }}
          saveToLocalByLongPress={false}
          index={initIndex}
          onClick={() => changeImgViewVisible(false)}
          imageUrls={[
            {
              url: imgViewSrc,
            },
          ]}
        />
      </ModalFull>
    );
  };
  // 预览视频
  const VideoView = () => {
    return (
      <ModalFull
        style={styles.viewModal}
        visible={videoObj.videView}
        transparent={true}>
        <TouchableOpacity
          onPress={() => {
            showViewVideo(false);
            setIsLoading(true);
          }}
          activeOpacity={1}
          style={styles.videoMask}>
          {isLoading && (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#000',
                zIndex: 999,
              }}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )}
          <Video
            resizeMode={'cover'}
            paused={videoObj.videoPasue}
            source={{uri: videoObj.videoSrc}}
            style={styles.modalVideo}
            onLoad={handleLoad}></Video>
        </TouchableOpacity>
      </ModalFull>
    );
  };

  //显示视频预览
  const showViewVideo = (falg: boolean, item?: any) => {
    changeVideoObj({
      videoPasue: !falg,
      videoSrc: item || '',
      videView: falg,
    });
  };

  useEffect(() => {
    if (currentId !== 0) {
      run(currentId === 1 || currentId === 3 ? searchVal : '');
    }
  }, [currentId]);

  const renderSearch = (currentId: number) => {
    if (currentId == 3 || currentId == 5) {
      return null;
    }
    return (
      <SearchInput
        placeholder={t('搜索')}
        style={{
          margin: pt(16),
          marginBottom: 0,
        }}
        value={searchVal}
        onChange={_.debounce((val: string) => {
          if (currentId !== 0) {
            run(val);
          }
          setSearchVal(val);
        }, 200)}
      />
    );
  };

  const renderContent = (currentId: number) => {
    let content = null;
    if (!messageList.length && currentId != 0) {
      return (
        <View style={{height: pt(400)}}>
          <Empty />
        </View>
      );
    }
    switch (currentId) {
      // 文件
      case 6:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            data={messageList}
            contentContainerStyle={{
              padding: pt(16),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onLongPress={() => {
                    setForwardData(item);
                    setIsShow(true);
                  }}
                  key={index}
                  row
                  style={{marginBottom: pt(15)}}>
                  <Image
                    assetName="file"
                    assetGroup="icons.app"
                    style={{
                      width: pt(46),
                      height: pt(46),
                    }}
                  />
                  <View style={{marginLeft: pt(11)}}>
                    <Text
                      style={{
                        fontSize: pt(15),
                        color: '#5B5B5B',
                        fontWeight: '500',
                        marginBottom: pt(13),
                      }}>
                      {content?.file_info?.file_name}
                    </Text>
                    <View row>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                        }}>
                        {item?.send_time
                          ? moment(item.send_time).format('YYYY-MM-DD HH:ss')
                          : ''}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {item.send_nickname}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {formatFileSize(content.file_size)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        );
        break;
      // 链接
      case 10:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            data={messageList}
            contentContainerStyle={{
              padding: pt(16),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              return (
                <View key={index} row style={{marginBottom: pt(15)}}>
                  <View style={{marginLeft: pt(11)}}>
                    <Text
                      underline={true}
                      onPress={() => {
                        Linking.openURL(content.text);
                      }}
                      onLongPress={() => {
                        setForwardData(item);
                        setIsShow(true);
                      }}
                      style={{
                        fontSize: pt(15),
                        //color: '#5B5B5B',
                        color: Colors.blue10,
                        fontWeight: '500',
                        marginBottom: pt(13),
                      }}>
                      {content.text}
                    </Text>
                    <View row>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                        }}>
                        {item?.send_time
                          ? moment(item.send_time).format('YYYY-MM-DD HH:ss')
                          : ''}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {item.send_nickname}
                      </Text>
                      <Text
                        style={{
                          fontSize: pt(12),
                          color: '#999',
                          marginLeft: pt(8),
                        }}>
                        {formatFileSize(content.file_size)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        );
        break;
      // 视频
      case 5:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            numColumns={4}
            data={messageList}
            contentContainerStyle={{
              padding: pt(4),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              let url =
                content.video_info?.file_url ?? content.video_info?.file_url;
              if (url) {
                url = formatUrl(url);
              }
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    showViewVideo(true, url);
                  }}
                  onLongPress={() => {
                    setForwardData(item);
                    setIsShow(true);
                  }}
                  key={index}
                  style={{
                    marginHorizontal: pt(2),
                    width: pt(88),
                    height: pt(88),
                    borderRadius: pt(6),
                    backgroundColor: '#F7F8FC',
                  }}>
                  <Video
                    source={{uri: url}}
                    paused
                    muted
                    resizeMode="cover"
                    style={{
                      width: pt(88),
                      height: pt(88),
                      borderRadius: pt(6),
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        );
        break;
      // 图片
      case 3:
        content = (
          <FlatList
            key={currentId}
            style={{flex: 1}}
            numColumns={4}
            data={messageList}
            contentContainerStyle={{
              padding: pt(4),
              paddingVertical: pt(32),
            }}
            renderItem={({item, index, separators}) => {
              const content = item.content ? JSON.parse(item.content) : {};
              let url =
                content.image_info?.thumb_url ?? content.image_info?.image_url;
              if (url) {
                url = formatUrl(url);
              }
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    changeImgViewVisible(true);
                    changeImgSrc(url);
                  }}
                  onLongPress={() => {
                    setForwardData(item);
                    setIsShow(true);
                  }}
                  key={index}
                  style={{
                    marginHorizontal: pt(2),
                    width: pt(88),
                    height: pt(88),
                    borderRadius: pt(6),
                    backgroundColor: '#F7F8FC',
                  }}>
                  <Image
                    source={{uri: url}}
                    style={{
                      width: pt(88),
                      height: pt(88),
                      borderRadius: pt(6),
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        );
        break;
    }
    return content;
  };

  return (
    <>
      <Navbar title="我的收藏" />
      <View flex>
        <View
          row
          centerV
          style={{
            paddingTop: pt(15),
            justifyContent: 'space-around',
          }}>
          {DATA.map((item, idx) => {
            const viewDiffStyle =
              item.id === currentId
                ? {
                    paddingBottom: pt(10),
                    borderBottomWidth: pt(2),
                    borderBottomColor: '#7581FF',
                  }
                : {};
            const textDiffStyle =
              item.id === currentId
                ? {fontSize: pt(16), fontWeight: 'bold', color: '#7581FF'}
                : {fontSize: pt(14), color: '#666666'};

            return (
              <TouchableOpacity
                key={idx}
                activeOpacity={1}
                onPress={() => {
                  setCurrentId(item.id);
                  setSearchVal('');
                }}
                style={{
                  ...viewDiffStyle,
                }}>
                <Text
                  style={{
                    ...textDiffStyle,
                  }}>
                  {t(item.label)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <ImageView></ImageView>
        <VideoView></VideoView>
        {renderSearch(currentId)}
        {renderContent(currentId)}
        {/**转发 */}
        <ActionSheet
          isShow={isShow}
          onCancel={() => setIsShow(false)}
          buttons={[
            {
              label: t('转发'),
              onClick: () => {
                setIsShow(false);
                navigate({
                  name: 'ForwardChat',
                  params: {msgs: [forwardData]},
                });
              },
            },
          ]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  viewModal: {
    position: 'absolute',
    height: pt(200),
    width: pt(1000),
    backgroundColor: 'rgba(0,0,0,.4)',
  },
  videoMask: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#000',
    width: '100%',
  },
  modalVideo: {
    width: '100%',
    height: pt(300),
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: pt(-150),
  },
});
