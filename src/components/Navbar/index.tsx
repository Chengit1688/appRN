import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {pt} from '@/utils/dimension';
import SvgIcon from '../SvgIcon';

function Navbar({title, left, right, back = true, seize = true}: any) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={{position: 'relative', zIndex: 10}}>
      {/* 占位高度 */}
      {!!seize && (
        <View style={{height: insets.top + +pt(49), backgroundColor: '#fff'}} />
      )}
      {/* 导航栏 */}
      <View style={styles.navbarBox}>
        {/* 顶部安全区域 */}
        <View style={{height: insets.top}} />
        {/* 导航栏内容 */}
        <View style={styles.navbarContainer}>
          <View style={styles.leftArea}>
            {!!back && (
              <TouchableOpacity
                style={styles.navBack}
                onPress={() => {
                  navigation.goBack();
                }}>
                <SvgIcon
                  name="navBack"
                  style={{
                    width: pt(10),
                    height: pt(16),
                  }}
                />
              </TouchableOpacity>
            )}
            {!!left && <View style={styles.leftRender}>{left}</View>}
          </View>
          <Text style={styles.title}>{title}</Text>
          {!!right && <View style={styles.rightArea}>{right}</View>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: pt(49),
    justifyContent: 'center',
    position: 'relative',
  },
  title: {
    fontSize: pt(18),
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'PingFang SC',
  },
  navBack: {
    paddingHorizontal: pt(16),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftArea: {
    position: 'absolute',
    left: pt(0),
    top: 0,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftRender: {
    marginLeftleft: pt(15),
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rightArea: {
    position: 'absolute',
    right: pt(15),
    top: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default Navbar;
