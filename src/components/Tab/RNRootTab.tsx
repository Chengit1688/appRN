import React, {useCallback, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {
  Assets,
  TabController,
  Colors,
  View,
  Text,
  Button,
  TabControllerItemProps,
  TabControllerImperativeMethods,
} from 'react-native-ui-lib';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';

import Message from '@/pages/Message';
import Contacts from '@/pages/Contacts';
import Discover from '@/pages/Discover';
import My from '@/pages/My';
import _ from 'lodash';

// const generateTabItems = () => {

// };

const TABS = [
  'Home',
  'Posts',
  'Reviews',
  'Videos',
  'Photos',
  'Events',
  'About',
  'Community',
  'Groups',
  'Offers',
];

const generateTabItems = (fewItems = false): TabControllerItemProps[] => {
  // @ts-expect-error
  const items: TabControllerItemProps[] = _.flow(
    tabs => _.take(tabs, fewItems ? 3 : TABS.length),
    (tabs: TabControllerItemProps[]) =>
      _.map<TabControllerItemProps>(
        tabs,
        (tab: TabControllerItemProps, index: number) => ({
          label: tab,
          key: tab,
          icon: index === 2 ? Assets.icons.tabMessage : undefined,
          badge: index === 5 ? {label: '2'} : undefined,
          leadingAccessory:
            index === 3 ? (
              <Text marginR-4>{Assets.emojis.movie_camera}</Text>
            ) : undefined,
          trailingAccessory:
            index === 4 ? (
              <Text marginL-4>{Assets.emojis.camera}</Text>
            ) : undefined,
        }),
      ),
  )(TABS);

  const addItem: TabControllerItemProps & {key: string} = {
    icon: Assets.icons.add,
    key: 'add',
    ignore: true,
    width: 60,
    onPress: () => {},
  };

  return fewItems ? items : [...items, addItem];
};

const RNRootTab = () => {
  const [key] = useState(0);
  const [asCarousel] = useState(false);
  const [centerSelected, setCenterSelected] = useState(false);
  const [initialIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fewItems] = useState(false);
  const [items] = useState(generateTabItems(false));

  const tabController = useRef<TabControllerImperativeMethods>();

  const onChangeIndex = useCallback((idx: number) => {
    setSelectedIndex(idx);
  }, []);

  const renderLoadingPage = () => {
    return (
      <View flex center>
        <ActivityIndicator size="large" />
        <Text text60L marginT-10>
          Loading
        </Text>
      </View>
    );
  };

  const renderTabPages = () => {
    const Container = asCarousel ? TabController.PageCarousel : View;
    const containerProps = asCarousel ? {} : {flex: true};
    return (
      <Container {...containerProps}>
        <TabController.TabPage index={0}>
          <Message />
        </TabController.TabPage>
        <TabController.TabPage index={1}>
          <Contacts />
        </TabController.TabPage>
        <TabController.TabPage
          index={2}
          lazy
          lazyLoadTime={1500}
          renderLoading={renderLoadingPage}>
          <Discover />
        </TabController.TabPage>

        {!fewItems &&
          _.map(_.takeRight(TABS, TABS.length - 3), (title, index) => {
            return (
              <TabController.TabPage key={title} index={index + 3}>
                <View padding-s5>
                  <Text text40>{title}</Text>
                </View>
              </TabController.TabPage>
            );
          })}
      </Container>
    );
  };

  return (
    <View flex>
      <TabController
        ref={tabController}
        key={key}
        asCarousel={asCarousel}
        initialIndex={initialIndex}
        onChangeIndex={onChangeIndex}
        items={items}>
        <TabController.TabBar
          // items={items}
          key={key}
          // uppercase
          // indicatorStyle={{backgroundColor: 'green', height: 3}}
          // indicatorInsets={0}
          spreadItems={!fewItems}
          backgroundColor={fewItems ? 'transparent' : undefined}
          // labelColor={'green'}
          // selectedLabelColor={'red'}
          labelStyle={styles.labelStyle}
          selectedLabelStyle={styles.selectedLabelStyle}
          // iconColor={'green'}
          // selectedIconColor={'blue'}
          enableShadow
          activeBackgroundColor={Colors.$backgroundPrimaryMedium}
          centerSelected={centerSelected}
        />
        {renderTabPages()}
      </TabController>
    </View>
  );
};

//export default RNRootTab;
export default gestureHandlerRootHOC(RNRootTab);


const styles = StyleSheet.create({
  labelStyle: {
    fontSize: 16,
  },
  selectedLabelStyle: {
    fontSize: 16,
  },
});
