import { Dimensions, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { View,Text, Icon, Avatar } from 'react-native-ui-lib'
import { pt } from '@/utils/dimension'
import {  useTranslation} from "react-i18next"

export default function WhoWatchDialog(props:any) {
    const {t} = useTranslation()
  const {isVisible} = props
  return (
    <View style={styles.dialog}>
        <View style={styles.dialogContent}>
            <View style={styles.header}>
                <Text style={styles.title}>{t('谁可以看')}</Text>
                <Icon style={styles.close} assetName="add" assetGroup="page.friends" size={pt(20)}></Icon>
            </View>
            <View style={{...styles.whoItem, marginTop:pt(20)}}>
                <Text style={styles.itemTitle}>{t('以下标签内的朋友')}</Text>
                <View style={{...styles.flexRow, marginTop: pt(17)}}>
                    <Text style={styles.tagName}>家人</Text>
                    <View style={styles.flexRow}>
                        <Text style={styles.nums}>1人</Text>
                        <Icon assetName="next_smail" assetGroup="icons.app" size={pt(12)} />
                    </View>
                </View>
            </View>
            <View style={{...styles.whoItem, marginTop:pt(20)}}>
                <Text style={styles.itemTitle}>{t('其他朋友')}</Text>
                <View style={{...styles.flexRow, marginTop: pt(17)}}>
                   <Avatar  size={50} source={{uri:'https://static.pexels.com/photos/60628/flower-garden-blue-sky-hokkaido-japan-60628.jpeg'}}></Avatar>
                   <Text style={styles.nickName}>An Customer No.</Text>
                </View>
            </View>
            
            <Text style={styles.tips}>{t('修改可见范围')}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    dialog:{
        position:'absolute',
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor: 'rgba(0,0,0,.4)',
        overflow:'hidden'
    },
    dialogContent:{
        position:"absolute",
        height:  Dimensions.get("screen").height * 3 / 4,
        width: Dimensions.get("screen").width,
        bottom:0,
        left:0,
        backgroundColor:'#fff',
        borderTopLeftRadius:pt(20),
        borderTopRightRadius:pt(20),
        padding:pt(20)
    },
    header:{
        position:'relative',
        width:'100%',

    },
    title:{
        textAlign:'center',
        fontSize:pt(15),
        fontWeight: 'bold',
        color:"#333"
    },
    whoItem:{
        backgroundColor:'#F6F7FB',
        padding:pt(13),
        borderRadius:pt(7)

    },
    itemTitle:{
        fontSize:pt(14),
        color:'#383E5C',
        fontWeight:'500',

    },
    flexRow:{
        flexDirection:"row",
        alignItems:'center'
    },
    tagName:{
        fontSize: pt(16),
        color:'#181922',
        flex:1,
    },
    nums:{
        fontSize: pt(14),
        color:'#9196AE',
        fontWeight:'500'
    },
    nickName:{
        marginLeft:pt(10),
        color:"#222"
    },
    close:{
        position:"absolute",
        right:pt(10),
        transform: [{rotate:'45deg'}]
    },
    tips:{
        position:'absolute',
        bottom:pt(120),
        width: Dimensions.get("screen").width,
        left: 0,
        textAlign:'center',
        color:"#A5A9BC"
    }

})