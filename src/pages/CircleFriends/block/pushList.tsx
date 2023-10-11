
import React, { useEffect, useState } from 'react'
import { View, Text,Icon, ListItem, Image, TouchableOpacity } from 'react-native-ui-lib'
import { pt } from '@/utils/dimension'
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, shallowEqual} from "react-redux"
import { useRoute} from "@react-navigation/native"
import _ from 'lodash';

type paramsType = {
    selectedsList: any[]
}


export default function PushList({
    inviteFriend,
    locationInfo,
    whoSeeData,
}:{
    inviteFriend?: any[],
    whoSeeData?: any,
    locationInfo?: {
        address: string,
        name: string
    }
}
) {
    const { navigate } = useNavigation()
    const { params } = useRoute<any>()
    const {t} = useTranslation();
    const friends  = whoSeeData?.friends.map((item:any)=> item.nick_name).join(",") || "";

     const selecteds = inviteFriend?.reduce((result:any, user:any) => {
        result[user.user_id] = true;
        return result;
      }, {});
    const tags  = Object.values(whoSeeData?.tags).map((item:any)=> item.title).join(",") || ""
    // const locationInfo =  useSelector((state:any) => state.circle.locationInfo, shallowEqual)
    // const whoSeeData =  useSelector((state:any) => state.circle.whoSee, shallowEqual)
    // const [selecteds, changeSelecteds] = useState<any>([]) //选中的人

    // useEffect(()=>{
    //     if(params?.selectedsList){
    //         changeSelecteds(params.selectedsList)
    //     }
    // },[params])


    return (
        <View style={{marginTop: pt(40)}}>
            <View row centerV>
                <Icon assetName="location" assetGroup="page.friends" size={pt(20)} />
                <TouchableOpacity onPress={()=>{
                    navigate("locationSearch" as never)
                }} row centerV style={styles.itemMain}>
                    <Text style={{
                            color: '#222222',
                            fontSize: pt(16),
                            flex:1
                        }}>
                        {locationInfo && locationInfo.name ? locationInfo.name :  t('所在位置')} 
                    </Text>
                    <Icon assetName="next" assetGroup="icons.app" size={pt(12)} />
                </TouchableOpacity>
            </View>
        <View row centerV>
            <Icon assetName="remind" assetGroup="page.friends" size={pt(20)} />
            <TouchableOpacity activeOpacity={1}
                onPress={()=>{  navigate("circleContacts", {source: 'publish',selecteds:selecteds})}}
             row centerV style={styles.itemMain}>
                 <Text style={{
                        color: '#222222',
                        fontSize: pt(16),
                        flex:1
                    }}>
                        {t('提醒谁看')}
                 </Text>
                 <View row centerV>
                    <View row style={{
                        width:pt(170),
                        flexWrap:'wrap',
                        justifyContent:'flex-end'
                    }}>
                        {
                            _.map(inviteFriend, (item:any, index:number) => <Image     
                                key={index}
                                style={styles.whoImg}
                                source={{uri:item.face_url}}
                            ></Image>)  
                        }

                        {/* <Image style={styles.whoImg} source={{uri:'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2F9e18d14b-8a44-41b0-97d9-6aed05b70e7f%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1693041951&t=60990dff5d8253ed8b1830b31800aca9'}}></Image> */}
                    </View>
                    <Icon assetName="next" assetGroup="icons.app" size={pt(12)} />
                 </View>
            </TouchableOpacity>
        </View>
        <View row>
            <Icon style={{ marginTop:pt(18)}} assetName="whoSee" assetGroup="page.friends" size={pt(20)} />
            <TouchableOpacity activeOpacity={1}
                onPress={()=>{  navigate("whoWatch", {whoSeeData})}}
             row style={{...styles.itemMain, borderBottomWidth:pt(0)}}>
                <View style={{ flex:1}}>
                    <Text style={{
                            color: '#222222',
                            fontSize: pt(16),
                        
                        }}>
                            {t('谁可以看')}
                    </Text>
                    {
                        whoSeeData.status === 1 ? 
                        <>
                        {
                            tags ? <Text style={styles.tag}>{`-标签:${tags}`}</Text> : null
                        }
                        {
                            friends ? <Text style={{...styles.tag, marginTop:pt(8)}}>{`-朋友:${friends}`}</Text> :null
                        } 
                        </>:null
                         
                    }
                    {/* <Text style={styles.tag}>-标签:同学、同事</Text>
                    <Text style={{...styles.tag, marginTop:pt(8)}}>-朋友: Auneo Marinir Space</Text> */}
                 </View>
                 <View row centerV>
                    {
                        whoSeeData.status === 2 ||   whoSeeData.status === 3 ?
                        <Text style={{ marginRight: pt(5), fontSize:pt(15)}}>{ whoSeeData.status === 2 ? '公开':'私密' } </Text>: null
                    }
                    
                    <Icon assetName="next" assetGroup="icons.app" size={pt(12)} />
                 </View>
            </TouchableOpacity>
        </View>
       
    </View>
  )
}

const styles =StyleSheet.create({
    itemMain:{
        borderBottomWidth: pt(1),
        borderBottomColor:'#F7F7F7',
        marginLeft:pt(16),
        padding:pt(16),
        paddingLeft: pt(0),
        paddingRight: pt(0),
        flex:1
    },
    tag:{
        marginTop:pt(14),
        color:"#666",
        fontSize:pt(13)
    },
    whoImg:{
        width:pt(30),
        height:pt(30),
        borderRadius:pt(5),
        overflow:"hidden",
        marginRight:pt(5),
        marginTop:pt(2),
        marginBottom:pt(2),
       
        backgroundColor:"#ddd"
    }
})