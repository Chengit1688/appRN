import {ReactElement, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {
  View,
  Text,
  ListItem,
  Avatar,
  TouchableOpacity,
  RadioButton,
  Assets,
} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pinyin} from 'pinyin-pro';
import {pt} from '@/utils/dimension';
import {formatUrl} from '@/utils/common';
import FastImage from 'react-native-fast-image';
import {Toast} from '@ant-design/react-native';

type GroupType = {
  admins_total: number;
  ban_remove_by_normal: number;
  conversation_id: string;
  create_time: number;
  create_user_id: string;
  face_url: string;
  group_id: string;
  group_send_limit: number;
  id: string;
  introduction: string;
  is_default: number;
  is_disturb: number;
  is_open_admin_icon: number;
  is_open_admin_list: number;
  is_open_group_id: number;
  is_topannocuncement: number;
  is_topchat: number;
  join_need_apply: number;
  last_member_version: number;
  last_version: number;
  members_total: number;
  mute_all_member: number;
  mute_all_period: null;
  name: string;
  no_show_all_member: number;
  no_show_normal_member: number;
  notification: string;
  robot_total: number;
  role: string;
  show_qrcode_by_normal: number;
  status: number;
};

type listItemType = {
  key: string;
  value: GroupType[];
};

type selectedType = {
  [key: string]: boolean;
};

const formatGroups = (Groups: GroupType[]) => {
  const letters: string[] = [];
  const newGroups: Map<string, GroupType[]> = new Map();
  const listItems: listItemType[] = [];

  Groups.forEach(item => {
    const name = item.name;
    let letter = '#';
    if (item) {
      letter = pinyin(name.charAt(0), {
        pattern: 'first',
        toneType: 'none',
      }).toUpperCase();
      if (!/^[A-Za-z]+$/.test(letter)) {
        letter = '#';
      }
    }
    letters.push(letter);

    if (newGroups.has(letter)) {
      newGroups.get(letter)?.push(item);
    } else {
      newGroups.set(letter, [item]);
    }
  });

  newGroups.forEach((value, key, map) => {
    listItems.push({
      key,
      value,
    });
  });

  listItems.sort((a, b) => {
    return a.key.charCodeAt(0) - b.key.charCodeAt(0);
  });

  return {letters: Array.from(new Set(letters)).sort(), GroupList: listItems};
};

//let firstItem = true;

export default function GroupIndexList({
  header,
  showSelect,
  onSelected,
  selecteds,
  disabledSelecteds,
  onPress,
  source,
  type = 'multiple',
}: {
  header?: ReactElement;
  showSelect?: boolean;
  onSelected?: (val: selectedType) => void;
  selecteds?: selectedType;
  disabledSelecteds?: selectedType;
  onPress?: (uid: string, info?: any) => void;
  source?: GroupType[];
  type?: 'sigle' | 'multiple';
}) {
  const {t} = useTranslation();

  const [indexLetters, setIndexLetters] = useState<string[]>([]);
  const [listGroups, setListGroups] = useState<listItemType[]>();

  const showRadio =
    onSelected && selecteds ? (showSelect !== false ? true : false) : false;

  const onItemPress = (group: GroupType) => {
    /**
     * 只能选择5个群
     */
    const gid = group.group_id;

    const obj = Object.keys(selecteds ?? {});

    if (type === 'sigle') {
      const data: selectedType = {};
      data[gid] = true;
      onSelected ? onSelected(data) : null;
      return;
    }
    let data = {...selecteds};
    if (data[gid]) {
      delete data[gid];
    } else {
      if (obj.length >= 5) {
        Toast.info('最多只能选择5个群');
        return;
      }
      data[gid] = true;
    }
    onSelected ? onSelected(data) : null;
  };

  useEffect(() => {
    const Groups = source ?? [];
    const {letters, GroupList} = formatGroups(Groups);
    setListGroups(GroupList);
    setIndexLetters(letters);
  }, [source]);

  const getIndexLetter = (letters: string[]) => {
    const list: any[] = [];

    const renderIndexLetter = (name: string, idx: number) => {
      let letter = '';
      if (name) {
        letter = pinyin(name.charAt(0), {
          pattern: 'first',
          toneType: 'none',
        }).toUpperCase();
      }

      //setcurrentLetter(letter);

      return (
        <TouchableOpacity activeOpacity={0.1} key={idx}>
          <Text
            style={{
              paddingTop: pt(2),
              paddingBottom: pt(2),
              fontWeight: 'bold',
              fontSize: pt(11),
              color: '#222222',
            }}>
            {letter}
          </Text>
        </TouchableOpacity>
      );
    };

    letters.forEach((letter, idx) => {
      list.push(renderIndexLetter(letter, idx));
    });

    return list;
  };

  const renderItem = ({item}: {item: listItemType}) => {
    const letter = item.key;
    const Groups = item.value;
    const subItem: any[] = [];

    Groups.forEach((item, idx) => {
      subItem.push(renderGroup(item, idx));
    });

    return (
      <>
        <View>
          <Text
            style={{
              marginLeft: pt(24),
              marginTop: pt(25),
              marginBottom: pt(18),
              fontSize: pt(18),
              color: '#222222',
            }}>
            {letter}
          </Text>
        </View>
        {subItem}
        <View
          style={{
            height: pt(10),
            backgroundColor: '#F7F8FC',
          }}
        />
      </>
    );
  };

  const renderGroup = (Group: GroupType, idx: number) => {
    const gid: string = Group.group_id;
    const name: string = Group.name;
    const avatarUrl: string = Group.face_url;
    const avatar = avatarUrl
      ? {
          uri: formatUrl(avatarUrl),
          cache: FastImage.cacheControl.web,
        }
      : Assets.imgs.avatar.group;
    // let avatarData = {
    //   name: name,
    //   size: pt(40),
    //   source: {
    //     uri: formatUrl(avatarUrl),
    //   },
    // };
    // if (!avatarUrl) {
    //   avatarData.source = Assets.imgs.avatar.group;
    // }

    return (
      <View key={idx}>
        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(60)}
          onPress={() => {
            showRadio
              ? onItemPress(Group)
              : onPress
              ? onPress(gid, Group)
              : null;
          }}>
          <ListItem.Part
            left
            containerStyle={{
              marginLeft: pt(34),
            }}>
            {showRadio ? (
              <View
                style={{
                  marginLeft: pt(-10),
                  marginRight: pt(12),
                }}>
                <RadioButton
                  selected={
                    (selecteds && selecteds[gid]) ||
                    (disabledSelecteds && disabledSelecteds[gid])
                  }
                  disabled={disabledSelecteds && disabledSelecteds[gid]}
                  onPress={() => {
                    if (disabledSelecteds && disabledSelecteds[gid]) {
                      return;
                    }
                    onItemPress(Group);
                  }}
                  label={''}
                  size={20}
                  color={selecteds && selecteds[gid] ? '#7581FE' : '#BCBCBC'}
                />
              </View>
            ) : null}
            {/* <Avatar {...avatarData} /> */}
            <FastImage
              source={avatar}
              resizeMode="cover"
              style={{width: pt(40), height: pt(40), borderRadius: pt(20)}}
            />
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              // height: pt(70),
              marginLeft: pt(15.5),
              marginRight: pt(15.5),
            }}>
            <Text
              style={{
                color: '#222222',
                fontSize: pt(14),
                fontWeight: 'bold',
              }}>
              {name}
            </Text>
          </ListItem.Part>
        </ListItem>
      </View>
    );
  };

  return (
    <View
      flex
      style={{
        position: 'relative',
      }}>
      <FlatList
        data={listGroups}
        renderItem={renderItem}
        keyExtractor={(item, idx) => String(idx)}
        ListHeaderComponent={header ?? null}
      />
      <View
        centerV
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: pt(10),
        }}>
        <View
          center
          style={
            {
              // marginTop: pt(-60),
            }
          }>
          {getIndexLetter(indexLetters)}
        </View>
      </View>
    </View>
  );
}
