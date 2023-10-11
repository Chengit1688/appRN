import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors, RadioButton,TouchableOpacity } from 'react-native-ui-lib'
import { pt } from '@/utils/dimension'
import WhoWatchDialog from './block/whoWatchDialog'
import { useTranslation } from "react-i18next"
import { Navbar } from '@/components'
import HeaderRight from '@/components/HeaderRight/button'

export default function WhoWatch({ navigation, route} :any) {
 const {t} = useTranslation()
 const { params} = route;
 const [checkedStatus, setCheckedStatus] = useState(params?.whoSeeData?.status || 2) //默认公开
 const [friends, setFriends] = useState<any>(params?.whoSeeData?.friends || []) //选中的人的数组
 const [tags, setTags] = useState<any>(params?.whoSeeData?.tags || []) //选中的标签的数组


 useEffect(()=>{
    if(params?.selectedsList){
        setFriends(params?.selectedsList)
    }
    if(params?.tags){
        setTags(params?.tags)
    }
 },[params])

const hanleComplete = () =>{
    if(checkedStatus === 1 && friends.length === 0 && tags.length === 0){
       Alert.alert(t('请至少选择一个标签或者朋友'))
       return
    }
    navigation.navigate({name:'publishFriends', params:{ whoSeeData: { status:checkedStatus, friends, tags}}})
}
 
    

  return (

    <>
    <Navbar title={t('谁可以看')} right={ HeaderRight({
         text: t('完成'),
         onPress: () => {
             hanleComplete()
         },
    })}></Navbar>
    <ScrollView style={{
          backgroundColor: Colors.white,
      }}>
          <View style={{
              margin: pt(20)
          }}>
              <TouchableOpacity activeOpacity={1} onPress={() => {
                  setCheckedStatus(2)
              } } style={[styles.flexRow, styles.mt10]}>
                  <Text style={[styles.radio, checkedStatus === 2 ? styles.checkRadio : null]}></Text>
                  <View style={[styles.rightContext, styles.ml10]}>
                      <Text style={styles.fz16333}>{t('公开')}</Text>
                      <Text style={[styles.fz13666, styles.mt10]}>{t('所有朋友可见')}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => {
                  setCheckedStatus(3)
              } } style={[styles.flexRow, styles.mt20]}>
                  <Text style={[styles.radio, checkedStatus === 3 ? styles.checkRadio : null]}></Text>
                  <View style={[styles.rightContext, styles.ml10]}>
                      <Text style={styles.fz16333}>{t('私密')}</Text>
                      <Text style={[styles.fz13666, styles.mt10]}>{t('仅自己可见')}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={1} onPress={() => {
                  setCheckedStatus(1)
              } } style={[styles.flexRow, styles.mt20]}>
                  <Text style={[styles.radio, checkedStatus === 1 ? styles.checkRadio : null]}></Text>
                  <View style={[styles.rightContext, styles.ml10]}>
                      <Text style={styles.fz16333}>{t('部分可见')}</Text>
                      {checkedStatus === 1 ?
                          <View>
                             <TouchableOpacity activeOpacity={1} onPress={()=>{ navigation.navigate({name:"label", params: {source: 'whoWatch', selecteds: tags }}) }}>
                                <Text style={[styles.fz1475, styles.mt20]}>{t('选择标签')}</Text>
                              
                              {
                               Object.values(tags).length > 0 ? 
                                <Text style={[styles.fz1271, styles.mt10]}>{ Object.values(tags).map((item:any)=> item.title).join(",")}</Text> :
                                <Text style={[styles.fz12666, styles.mt10]}>{t('标签里的朋友可见，若在标签中新增或移出朋友，可见范围也将更新')}</Text>
                             }
                             </TouchableOpacity>
                              
                             <TouchableOpacity activeOpacity={1} onPress={()=>{ navigation.navigate({name:"circleContacts", params: {source: 'whoSee'}}) }}>
                                <Text style={[styles.fz1475, styles.mt20]}>{t('选择朋友')}</Text>
                             
                              {
                               friends.length > 0 ? 
                               <Text style={[styles.fz1271, styles.mt10]}>{friends.map((item:any)=> item.nick_name).join(",")}</Text> :
                              <Text style={[styles.fz12666, styles.mt10]}>{t('选中的朋友可见')}</Text>
                              
                             }
                              </TouchableOpacity>
                          </View> : null}

                  </View>
              </TouchableOpacity>
              {/* <TouchableOpacity activeOpacity={1} onPress={() => {
                  setCheckedStatus(0)
              } } style={[styles.flexRow, styles.mt20]}>
                  <Text style={[styles.radio, checkedStatus === 0 ? styles.checkRadio : null]}></Text>
                  <View style={[styles.rightContext, styles.ml10]}>
                      <Text style={styles.fz16333}>{t('不给谁看')}</Text>
                      {checkedStatus === 0 ?
                          <View>
                              <Text style={[styles.fz1475, styles.mt20]}>{t('选择标签')}</Text>
                              <Text style={[styles.fz12666, styles.mt10]}>{t('标签里的朋友不可见，若在标签中新增或移出朋友，可见范围也将更新')}</Text>
                              <Text style={[styles.fz1475, styles.mt20]}>{t('选择朋友')}</Text>
                              <Text style={[styles.fz12666, styles.mt10]}>{t('选中的朋友不可见')}</Text>
                          </View> : null}
                  </View>
              </TouchableOpacity> */}
          </View>

          {/* <WhoWatchDialog isVisible={true}></WhoWatchDialog> */}
      </ScrollView></>
  )
}

const styles = StyleSheet.create({
    flexRow:{
        flexDirection: 'row',
        
    },
    mt10:{
        marginTop: pt(10)
    },
    ml10:{
        marginLeft: pt(10)
    },
    mt20:{
        marginTop: pt(20)
    },
    radio:{
        width:pt(16),
        height:pt(16),
        borderWidth:pt(1),
        borderRadius: pt(8),
        borderColor: "#BCBCBC"
    },
    checkRadio:{
        borderWidth:pt(5),
        borderColor:'#7581FE'
    },
    fz16333:{
        fontSize:pt(16),
        color:"#333333",
        fontWeight:'500'
    },
    fz1475:{
        fontSize:pt(14),
        color:"#7581FF",
        fontWeight:'500'
    },

    fz13666:{
        fontSize:pt(13),
        color:"#666",
    },
    fz12666:{
        fontSize:pt(12),
        color:"#666",
    },
    fz1271:{
        fontSize:pt(12),
        color:"#7581FF",
    },
    rightContext:{
        flex:1,
        paddingBottom: pt(20),
        borderBottomColor: "rgba(191, 191, 191,.2)",
        borderBottomWidth: pt(1)
        
    }
})