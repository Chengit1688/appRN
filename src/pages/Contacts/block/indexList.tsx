import {FlatList} from 'react-native';
import {View, Text, Icon, SectionList, Avatar} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pinyin} from 'pinyin-pro';
import {pt} from '@/utils/dimension';
import {useEffect, useState} from 'react';

type contactType = (typeof contacts)[0];

type listItemType = {
  key: string;
  value: contactType[];
};

const contacts = [
  {
    name: '张三',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    name: '李四',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    name: '王五',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    name: '赵六',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    name: '孙七',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    name: '周八',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    name: '吴九',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
  {
    name: '郑十',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
  },
];

const DATA = [
  {
    title: 'Main dishes',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Sides',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream'],
  },
];

export default function IndexList() {
  const {t} = useTranslation();

  const [indexLetters, setIndexLetters] = useState<string[]>([]);
  const [listContacts, setListContacts] = useState<listItemType[]>();

  useEffect(() => {
    let letters: string[] = [];
    const newContacts: Map<string, contactType[]> = new Map();

    contacts.forEach(item => {
      let letter = '#';
      if (item) {
        letter = pinyin(item.name.charAt(0), {
          pattern: 'first',
          toneType: 'none',
        }).toUpperCase();
      }
      letters.push(letter);

      if (newContacts.has(letter)) {
        newContacts.get(letter)?.push(item);
      } else {
        newContacts.set(letter, [item]);
      }
    });

    const arr: listItemType[] = [];
    newContacts.forEach((value, key, map) => {
      arr.push({
        key,
        value,
      });
    });

    arr.sort((a, b) => {
      return a.key.charCodeAt(0) - b.key.charCodeAt(0);
    });

    setListContacts(arr);

    letters = Array.from(new Set(letters));
    letters.sort();
    setIndexLetters(letters);
  }, [contacts]);

  const getIndexLetter = (letters: string[]) => {
    const list: any[] = [];

    const renderIndexLetter = (name: string) => {
      let letter = '';
      if (name) {
        letter = pinyin(name.charAt(0), {
          pattern: 'first',
          toneType: 'none',
        }).toUpperCase();
      }

      //setcurrentLetter(letter);

      return (
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
      );
    };

    letters.forEach(letter => {
      list.push(renderIndexLetter(letter));
    });

    return list;
  };

  const renderItem = ({item}: {item: listItemType}) => {
    const letter = item.key;
    const contacts = item.value;
    const subItem: any[] = [];

    const getItem = (contact: contactType) => {
      const nickName: string = contact.name;
      const avatarUrl: string | undefined = contact.avatar;

      return (
        <View>
          <ListItem
            activeBackgroundColor={'#F8F9FF'}
            activeOpacity={1}
            height={pt(60)}
            onPress={() => {}}>
            <ListItem.Part
              left
              containerStyle={{
                marginLeft: pt(34),
              }}>
              <Avatar
                containerStyle={{}}
                {...{
                  name: '张三',
                  size: pt(40),
                  source: {
                    uri: 'https://randomuser.me/api/portraits/women/24.jpg',
                  },
                }}
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
                {nickName}
              </Text>
            </ListItem.Part>
          </ListItem>
        </View>
      );
    };

    contacts.forEach(item => {
      subItem.push(getItem(item));
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
          }}></View>
      </>
    );
  };

  return (
    <>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({item}) => (
          <View>
            <Text>{item}</Text>
          </View>
        )}
        renderSectionHeader={({section: {title}}) => <Text>{title}</Text>}
      />
      <View
        style={{
          position: 'absolute',
          bottom: pt(100),
          right: pt(10),
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: pt(10),
          flexShrink: pt(10),
        }}>
        {getIndexLetter(indexLetters)}
      </View>
    </>
  );
}
