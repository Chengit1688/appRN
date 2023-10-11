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

type contactType = {
  id: string;
  user_id: string;
  account: string;
  nick_name: string;
  face_url: string;
  age: number;
  gender: number;
  phone_number: string;
  remark: string;
  signatures: string;
  black_status: number;
  create_time: number;
  friend_status: number;
};

type listItemType = {
  key: string;
  value: contactType[];
};

type selectedType = {
  [key: string]: boolean;
};

const formatContacts = (contacts: contactType[]) => {
  const letters: string[] = [];
  const newContacts: Map<string, contactType[]> = new Map();
  const listItems: listItemType[] = [];

  contacts.forEach(item => {
    const nickName = item.nick_name;
    let letter = '#';
    if (item) {
      letter = pinyin(nickName.charAt(0), {
        pattern: 'first',
        toneType: 'none',
      }).toUpperCase();
      if (!/^[A-Za-z]+$/.test(letter)) {
        letter = '#';
      }
    }
    letters.push(letter);

    if (newContacts.has(letter)) {
      newContacts.get(letter)?.push(item);
    } else {
      newContacts.set(letter, [item]);
    }
  });

  newContacts.forEach((value, key, map) => {
    listItems.push({
      key,
      value,
    });
  });

  listItems.sort((a, b) => {
    return a.key.charCodeAt(0) - b.key.charCodeAt(0);
  });

  return {letters: Array.from(new Set(letters)).sort(), contactList: listItems};
};

//let firstItem = true;

export default function ContactIndexList({
  header,
  showSelect,
  onSelected,
  selecteds,
  disabledSelecteds,
  onPress,
  source,
  right,
  type = 'multiple',
}: {
  header?: ReactElement;
  showSelect?: boolean;
  onSelected?: (val: selectedType) => void;
  selecteds?: selectedType;
  disabledSelecteds?: selectedType;
  onPress?: (uid: string, info?: any) => void;
  source?: contactType[];
  right?: (info: any) => void;
  type?: 'sigle' | 'multiple';
}) {
  const {t} = useTranslation();

  const [indexLetters, setIndexLetters] = useState<string[]>([]);
  const [listContacts, setListContacts] = useState<listItemType[]>();

  const showRadio =
    onSelected && selecteds ? (showSelect !== false ? true : false) : false;

  const onItemPress = (contact: contactType) => {
    const uid = contact.user_id;
    if (type === 'sigle') {
      const data: selectedType = {};
      data[uid] = true;
      onSelected ? onSelected(data) : null;
      return;
    }
    let data = {...selecteds};
    if (data[uid]) {
      delete data[uid];
    } else {
      data[uid] = true;
    }
    onSelected ? onSelected(data) : null;
  };

  useEffect(() => {
    const contacts = source ?? [];
    const {letters, contactList} = formatContacts(contacts);
    setListContacts(contactList);
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
    const contacts = item.value;
    const subItem: any[] = [];

    contacts.forEach((item, idx) => {
      subItem.push(renderContact(item, idx));
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

  const renderContact = (contact: contactType, idx: number) => {
    const uid: string = contact.user_id;
    const nickName: string = contact.remark || contact.nick_name;
    const avatar = contact?.face_url
      ? {uri: formatUrl(contact.face_url), cache: FastImage.cacheControl.web}
      : Assets.imgs.avatar.defalut;

    // const avatarUrl: string = contact.face_url;
    // let avatarData = {
    //   name: nickName,
    //   size: pt(40),
    //   source: {
    //     uri: formatUrl(avatarUrl),
    //   },
    // };
    // if (!avatarUrl) {
    //   avatarData.source = Assets.imgs.avatar.defalut;
    // }

    return (
      <View key={idx}>
        <ListItem
          activeBackgroundColor={'#F8F9FF'}
          activeOpacity={1}
          height={pt(60)}
          onPress={() => {
            showRadio
              ? onItemPress(contact)
              : onPress
              ? onPress(uid, contact)
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
                    (selecteds && selecteds[uid]) ||
                    (disabledSelecteds && disabledSelecteds[uid])
                  }
                  disabled={disabledSelecteds && disabledSelecteds[uid]}
                  onPress={() => {
                    if (disabledSelecteds && disabledSelecteds[uid]) {
                      return;
                    }
                    onItemPress(contact);
                  }}
                  label={''}
                  size={20}
                  color={selecteds && selecteds[uid] ? '#7581FE' : '#BCBCBC'}
                />
              </View>
            ) : null}
            {/* <Avatar {...avatarData} /> */}
            <FastImage
              style={{
                width: pt(40),
                height: pt(40),
                borderRadius: pt(20),
              }}
              resizeMode="cover"
              source={avatar}
            />
          </ListItem.Part>
          <ListItem.Part
            containerStyle={{
              // height: pt(70),
              marginLeft: pt(15.5),
              marginRight: pt(15.5),
              flex: 1,
            }}>
            <Text
              style={{
                color: '#222222',
                fontSize: pt(14),
                fontWeight: 'bold',
              }}>
              {nickName}
            </Text>
          </ListItem.Part>
          {right ? (
            <ListItem.Part
              right
              containerStyle={{
                marginRight: pt(30),
              }}>
              {right(contact)}
            </ListItem.Part>
          ) : null}
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
      {listContacts?.length > 0 ? (
        <FlatList
          data={listContacts}
          renderItem={renderItem}
          keyExtractor={(item, idx) => String(idx)}
          ListHeaderComponent={header ?? null}
          initialNumToRender={10}
        />
      ) : null}

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
