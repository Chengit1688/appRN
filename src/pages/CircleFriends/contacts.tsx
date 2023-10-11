import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, Icon, Image, Text, TextField, View } from 'react-native-ui-lib'

import { pt } from '@/utils/dimension'
import ContactIndexList from '@/components/ContactIndexList';
import { useTranslation } from "react-i18next"
import { shallowEqual, useSelector } from 'react-redux';
import NavBar from  "@/components/Navbar"
import _ from 'lodash';
import { useNavigation, useRoute} from "@react-navigation/native"
import headerRight from '@/components/HeaderRight/button';
import {formatUrl} from '@/utils/common';

type selectedType = {
    [key: string]: boolean;
  };

export default function Contacts(props:any) {
  const {t} = useTranslation()
  const { navigation } = props
  const { params } = useRoute<any>()
  const [isFocus, changeFocus] = useState(false)
  const ContactList = useSelector((state:any) => state.contacts.friendList, shallowEqual);

  const [friendList, changeFriendList] = useState(ContactList) //好友列表
  const [selecteds, changeSelecteds] = useState<selectedType>({...params?.selecteds}) //选中的人
  
  const [selectedsList, setSelectedsList] = useState<any>([]) //选中的人的数组

  //根据selecteds对象，与ContactList对比，返回选中的人
    useEffect(() => {  
        const selectedsArr = Object.keys(selecteds) //选中的人的id数组
        const selectedsList = ContactList.filter((item:any) => selectedsArr.includes(item.id))  //选中的人的数组
        setSelectedsList(selectedsList.map((item:any) => {
            return {
                ...item,
                face_url: formatUrl(item.face_url)
            }
        }))
    }, [selecteds])
                
//   const rightBtn = () => { 

//     return (
//         <TouchableOpacity onPress={()=>{
//             navigation.navigate({name:'publishFriends', params:{selectedsList}})
//         }}>
//             <Text style={{
//                 color:Colors.white, 
//                 fontSize:pt(14),
//                 backgroundColor:'#7581FF',
//                 padding:pt(6),
//                 borderRadius:pt(4),
//                 overflow:'hidden',
//                 textAlign:'center',
              

//             }}>{ `${t('完成')} ${selectedsList.length}/10`}</Text>
//        </TouchableOpacity>
//     )
//   }
  //搜索好友
  const handleSearchFriend = _.debounce((keyword:string) =>{
    const friendList = ContactList.filter((item:any) => item.nick_name.includes(keyword))
    changeFriendList(friendList)
  })

//完成选择
const hanleComplete = () =>{
    if(params.source === "publish" && selectedsList.length > 10){
        Alert.alert(t('最多选择10个好友'))
        return
    }
    const name = params.source === "publish" ? 'publishFriends' : 'whoWatch'
    navigation.navigate({name, params:{selectedsList}}) 
}

  return (
   <View style={{
        backgroundColor:Colors.white,
        height:'100%'
   }}>
    <NavBar title={t('选择好友')} right={headerRight({
        text: params.source === "publish" ? `${t('完成')} ${selectedsList.length}/10` : `${t('选择')} ${selectedsList.length > 0 ? `(${selectedsList.length})` : ''}`,
        onPress: () => {
            hanleComplete()     
        },
    })}></NavBar>
    <View style={styles.searchText}>
            {
                selectedsList.length > 0 ? 
                    <View style={{...styles.flexRow, marginRight:pt(7)}}>
                    {
                        _.map(selectedsList,((item,index)=> <Image key={index} style={styles.avatar} source={{uri:item.face_url}} ></Image>))
                    }

                    {/* <Image style={styles.avatar} source={{uri:'https://up.enterdesk.com/edpic_source/31/8c/55/318c5586cf3a7a757684d9567fdbee66.jpg'}} ></Image>
                    <Image style={styles.avatar} source={{uri:'https://up.enterdesk.com/edpic_source/31/8c/55/318c5586cf3a7a757684d9567fdbee66.jpg'}} ></Image> */}
                </View>:
                <Icon
                    assetName="search"
                    assetGroup="icons.compontent"
                    size={pt(16)}
                    style={{
                    marginRight: pt(7),
                    marginLeft: pt(10)
                    }}
                />
            }
            <TextField
                placeholder="搜索"
                    placeholderTextColor="#B1B1B2"
                    containerStyle={{
                    flex: 1,
                }}
              
               onChangeText={(val:string)=>{handleSearchFriend(val)}}
            />
    </View>
    {
      isFocus ? 
       <View style={styles.tags}>
            <Text style={styles.tagsTitle}>{t('通过标签筛选')}</Text>
            <View style={styles.tagList}>
                <Text onPress={()=>{ navigation.navigate({name:'labelContacts'}); changeFocus(false)}} style={styles.tagItem}>同学</Text>
            </View>
      </View>
      :
      <ContactIndexList selecteds={selecteds}
      onSelected={val => changeSelecteds(val)} source={friendList} ></ContactIndexList>
    }
    </View>
  )
}

const styles = StyleSheet.create({
    searchContent:{

    },
    flexRow:{
        flexDirection:'row'
    },
    searchText:{
        margin:pt(20),
        marginBottom:pt(10),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'nowrap',
        height: pt(45),
        // margin: pt(16),
        paddingRight: pt(20),
        borderWidth: pt(1),
        borderRadius: pt(6),
        borderColor: '#E3E3E3',
        backgroundColor: '#F8F8F8',  
    },
    avatar:{
        width:pt(35),
        height:pt(35),
        marginLeft:pt(5),
        borderRadius:pt(4),
        borderColor:'#fff',
        borderWidth:pt(1)
        
    },
    tags:{
        margin: pt(20),
        marginTop: pt(10)
    },
    tagsTitle:{
        fontSize: pt(13),
        color:"#B1B1B2",
        fontWeight:'500'
    },
    tagList:{
        flexDirection:'row', 
    },
    tagItem: {
        padding: pt(5),
        paddingLeft: pt(10),
        paddingRight: pt(10),
        backgroundColor:"rgba(117, 129, 255, .12)",
        textAlign:'center',
        borderRadius: pt(4),
        fontSize: pt(14),
        color: '#7581FF',
        marginTop: pt(10),
        marginRight: pt(10)

    }
})