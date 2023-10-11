import { View, Text,ScrollView, StyleSheet} from 'react-native'
import React from 'react'
import { Colors } from 'react-native-ui-lib'
import { pt } from '@/utils/dimension'
import { useTranslation} from "react-i18next"

export default function Location() {
  const {t} = useTranslation()
  return (
    <ScrollView style={{
        backgroundColor: Colors.white,
    }}>
        <View style={{
          padding:pt(20)
        }}>
            <View style={[styles.flexRow,styles.item,]}>
                <Text style={{...styles.fz16333, flex:1}}>{t('不显示位置')}</Text>
                <Text style={[styles.radio,styles.checkRadio]}></Text>
            </View>
            <View style={styles.item}>
                <Text style={{...styles.fz16333, flex:1}}>信阳市</Text>
            </View>  
            <View style={styles.item}>
                <Text style={{...styles.fz16333, flex:1}}>工业城企业服务广场</Text>
                <Text numberOfLines={1} style={styles.txt}>河南省信阳市平桥区工业城公十一路与公三路交叉口往右靠</Text>
            </View>  
            <View style={styles.item}>
                <Text style={{...styles.fz16333, flex:1}}>工业城企业服务广场</Text>
                <Text numberOfLines={1} style={styles.txt}>河南省信阳市平桥区工业城公十一路与公三路交叉口往右靠</Text>
            </View>
        </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flexRow:{
    flexDirection: 'row',
   
},
item:{
  borderBottomColor:'rgba(191,191,191,.2)',
  paddingTop: pt(20),
  paddingBottom: pt(20),
  borderBottomWidth: pt(1)
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
txt:{
  fontSize:pt(13),
  color:"#666",
   marginTop:pt(5)
}
})