import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {View, Text, StyleSheet, ViewabilityConfig} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';
const Render = ({renderItem, item, index, separators, isShow}: any) => {
  return (
    <View style={{overflow: 'hidden'}}>
      {renderItem({item, index, separators, isShow})}
    </View>
  );
};

const RenderItem = React.memo(Render);

const List = (props: any, ref) => {
  const {renderItem, haveMore = true, data} = props;
  const {t} = useTranslation();
  const listRef = useRef();
  useImperativeHandle(ref, () => listRef.current);

  const viewabilityConfig = React.useRef<ViewabilityConfig>({
    waitForInteraction: true,
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000,
  }).current;

  return (
    <FlashList
      estimatedItemSize={200}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={() =>
        data?.length > 0 && haveMore ? (
          <View style={Styles.loadingBox}>
            <Text style={{textAlign: 'center', color: '#727476'}}>
              {t('加载中...')}
            </Text>
          </View>
        ) : (
          <View style={Styles.loadingEmptyBox} />
        )
      }
      viewabilityConfig={viewabilityConfig}
      {...props}
      ref={listRef}
      renderItem={e => {
        return <RenderItem {...e} renderItem={renderItem} isShow={true} />;
      }}
      windowSize={4}
      removeClippedSubviews
    />
  );
};

const Styles = StyleSheet.create({
  loadingBox: {
    justifyContent: 'center',
    backgroundColor: 'none',
    height: pt(30),
  },
  loadingEmptyBox: {},
});

export default forwardRef(List);
