import {TouchableOpacity, Dimensions} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {View, Text} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';
import {Popup, SvgIcon} from '@/components';

export default function Notification({
  groupNotification,
}: {
  groupNotification: string;
}) {
  const [scrollX, setScrollX] = useState(0);
  const [textWidth, setTextWidth] = useState(0);

  const handleTextLayout = e => {
    e.persist();
    const {width} = e.nativeEvent.layout;
    setTextWidth(width);
  };
  const timerRef = useRef<any>(null);
  const [groupNotifVisible, setGroupNotifVisible] = useState(false);
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (scrollX <= -textWidth) {
        setScrollX(Dimensions.get('window').width);
      } else {
        setScrollX(scrollX => scrollX - 1);
      }
    }, 10);
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [textWidth, scrollX]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setGroupNotifVisible(true);
        }}
        style={{
          position: 'absolute',
          top: pt(0),
          backgroundColor: '#fff',
          width: '100%',
        }}>
        <View
          row
          centerV
          style={{
            backgroundColor: 'rgba(117, 129, 255,.1)',
            padding: pt(12),
          }}>
          <View
            style={{
              backgroundColor: 'rgba(117, 129, 255,.1)',
            }}>
            <SvgIcon
              name="horn"
              size={15}
              style={{
                width: pt(15),
                height: pt(15),
              }}></SvgIcon>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: pt(5000),
              transform: [{translateX: scrollX}],
            }}>
            <Text
              onLayout={handleTextLayout}
              style={{
                color: '#7581FF',
                fontSize: pt(13),
                marginLeft: pt(10),
                lineHeight: pt(18),
              }}>
              {groupNotification}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <Popup
        visible={groupNotifVisible}
        onDismiss={() => {
          setGroupNotifVisible(false);
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: pt(16),
            width: pt(300),
            minHeight: pt(100),
            borderRadius: pt(10),
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: pt(16),
            }}>
            群公告：
          </Text>
          <Text
            style={{
              marginTop: pt(15),
            }}>
            {groupNotification}
          </Text>
        </View>
      </Popup>
    </>
  );
}
