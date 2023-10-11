import {View, Text, Icon, TouchableOpacity, Badge} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt, opacity} from '@/utils/dimension';
import {useNavigation} from '@react-navigation/native';
import {SvgIcon} from '@/components';
import {shallowEqual, useSelector} from 'react-redux';
import {RootState} from '@/store';

export default function Cards({
  onPress,
}: {
  onPress: {
    newfriend: () => void;
    tag: () => void;
    blacklist: () => void;
  };
}) {
  const {t} = useTranslation();
  const {navigate} = useNavigation();
  const noticeCount = useSelector(
    (state: RootState) => state.contacts.noticeCount,
    shallowEqual,
  );

  return (
    <View
      style={{
        flexDirection: 'row',
      }}>
      <TouchableOpacity
        flex
        style={{
          paddingTop: pt(22),
          paddingBottom: pt(22),
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#fff000',
        }}
        onPress={() => {
          navigate({name: 'NewFriend'} as never);
        }}>
        <View
          style={{
            width: pt(47),
            height: pt(47),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: opacity('#52D05E', 0.1),
            borderRadius: 50,
          }}>
          <Icon
            assetName="newfriend"
            assetGroup="page.contact"
            size={pt(25)}
            style={{}}
          />
          {noticeCount.friendNotice > 0 ? (
            <View
              style={{
                position: 'absolute',
                right: pt(-5),
                top: pt(0),
              }}>
              <Badge
                label={noticeCount.friendNotice}
                size={16}
                backgroundColor="red"
              />
            </View>
          ) : null}
        </View>
        <View
          style={{
            marginTop: pt(12),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(14),
            }}>
            {t('新的朋友')}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        flex
        style={{
          paddingTop: pt(22),
          paddingBottom: pt(22),
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#fff000',
        }}
        onPress={() => {
          navigate({name: 'GroupVerify'} as never);
        }}>
        <View
          style={{
            width: pt(47),
            height: pt(47),
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: opacity('#52D05E', 0.1),
            borderRadius: 50,
          }}>
          <SvgIcon name="group" size={pt(47)} />
          {noticeCount.groupNotice > 0 ? (
            <View
              style={{
                position: 'absolute',
                right: pt(-5),
                top: pt(0),
              }}>
              <Badge
                label={noticeCount.groupNotice}
                size={16}
                backgroundColor="red"
              />
            </View>
          ) : null}
        </View>
        <View
          style={{
            marginTop: pt(12),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(14),
            }}>
            {t('群聊认证')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        flex
        style={{
          paddingTop: pt(22),
          paddingBottom: pt(22),
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#fff000',
        }}
        onPress={() => {
          navigate({name: 'label'} as never);
        }}>
        <View
          style={{
            width: pt(47),
            height: pt(47),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: opacity('#5D94FF', 0.1),
            borderRadius: 50,
          }}>
          <Icon
            assetName="tag"
            assetGroup="page.contact"
            size={pt(25)}
            style={{}}
          />
        </View>
        <View
          style={{
            marginTop: pt(12),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(14),
            }}>
            {t('标签')}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        flex
        style={{
          paddingTop: pt(22),
          paddingBottom: pt(22),
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: '#fff000',
        }}
        onPress={() => {
          navigate({name: 'Blacklist'} as never);
        }}>
        <View
          style={{
            width: pt(47),
            height: pt(47),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: opacity('#F6A352', 0.1),
            borderRadius: 50,
          }}>
          <Icon
            assetName="blacklist"
            assetGroup="page.contact"
            size={pt(25)}
            style={{}}
          />
        </View>
        <View
          style={{
            marginTop: pt(12),
          }}>
          <Text
            style={{
              color: '#222222',
              fontSize: pt(14),
            }}>
            {t('黑名单')}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
