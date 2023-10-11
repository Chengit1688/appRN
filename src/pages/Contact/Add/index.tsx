import {View, Text, Icon, TextField} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {pt} from '@/utils/dimension';
import {Navbar, Popup, ActionSheet} from '@/components';
import {useState} from 'react';
import Profile from './block/profile';
import Menu from './block/menu';
import {Toast} from '@ant-design/react-native';
import FullButton from '@/components/FullButton';
import imsdk from '@/utils/IMSDK';
import {useEffect} from 'react';
import {setAudioVideoObjStatus} from '@/store/reducers/global';
import {useDispatch} from 'react-redux';

export default function Add(props) {
  const id = props.route.params?.id;
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const {t} = useTranslation();
  const {goBack} = useNavigation();
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (id) {
      console.log(id, '===>id');
      imsdk.searchFriend(id).then(res => {
        setUserInfo(res || {});
      });
    }
  }, [id]);

  const onConfirm = async () => {
    imsdk
      .addFriend({
        user_id: id,
        req_msg: text,
        remark: '',
      })
      .then(res => {
        Toast.info({content: '添加成功'});
        setVisible(false);
        goBack();
      })
      .catch(res => {
        Toast.info({content: res.message});
        setVisible(false);
      });
  };

  return (
    <>
      <Navbar
        title={userInfo.status === 1 ? userInfo.nick_name : '添加联系人'}
      />
      <View flex>
        <Profile userInfo={userInfo} />
        {/* <Menu /> */}
      </View>
      {userInfo.status === 1 ? (
        <>
          <FullButton
            outline
            label={t('发消息')}
            icon={
              <Icon
                assetName="message"
                assetGroup="page.contact"
                size={pt(16)}
              />
            }
            onPress={() => {}}
            style={{
              marginTop: pt(0),
              marginBottom: pt(10),
            }}
          />
          <FullButton
            outline
            label={t('音视频通话')}
            icon={
              <Icon assetName="video" assetGroup="page.contact" size={pt(16)} />
            }
            onPress={() => {
              setIsShow(true);
            }}
            style={{
              marginTop: pt(0),
            }}
          />
        </>
      ) : (
        <FullButton
          label={t('添加到联系人')}
          style={{
            marginTop: pt(0),
          }}
          onPress={() => {
            setVisible(true);
          }}
        />
      )}
      <ActionSheet
        isShow={isShow}
        onCancel={() => setIsShow(false)}
        buttons={[
          {
            label: '语音通话',
            onClick: () => {
              setIsShow(false);
              dispatch(
                setAudioVideoObjStatus({
                  open: true,
                  conversation_type: 1,
                  type: 1, // 1 语音  2视频
                  user_id: userInfo.user_id,
                }),
              );
            },
          },
          {
            label: '视频通话',
            onClick: () => {
              setIsShow(false);
              dispatch(
                setAudioVideoObjStatus({
                  open: true,
                  conversation_type: 1,
                  type: 2, // 1 语音  2视频
                  user_id: userInfo.user_id,
                }),
              );
            },
          },
        ]}
      />
      <Popup
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <View
          style={{
            borderRadius: pt(10),
            backgroundColor: '#fff',
            padding: pt(15),
            width: pt(300),
          }}>
          <Text
            style={{
              fontSize: pt(15),
              fontWeight: 'bold',
              color: '#000',
              marginBottom: pt(20),
            }}>
            {t('填写验证信息')}
          </Text>
          <View
            style={{
              marginBottom: pt(20),
            }}>
            <TextField
              value={text}
              onChangeText={e => {
                setText(e);
              }}
              style={{
                borderBottomColor: 'rgba(102, 102, 102, 0.1)',
                borderBottomWidth: pt(1),
                height: pt(45),
              }}
              placeholder="填写验证信息"
            />
          </View>
          <FullButton
            text={t('确认')}
            onPress={onConfirm}
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
    </>
  );
}
