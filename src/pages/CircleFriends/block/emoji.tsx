import {Dispatch, SetStateAction} from 'react';
import {View} from 'react-native-ui-lib';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {pt} from '@/utils/dimension';

export default function Emoji({
  style,
  setEmoji,
  height = 0,
}: {
  value?: string;
  style?: any;
  setEmoji?: any;
}) {
  const onSelected = (emoji: string) => {
    setEmoji(emoji);
  };

  return (
    <View
      style={{
        height: pt(300),
        paddingTop: pt(5),
      }}>
      <EmojiSelector
        showSectionTitles={false}
        showTabs={false}
        showHistory={true}
        showSearchBar={false}
        columns={10}
        category={Categories.emotion}
        onEmojiSelected={onSelected}
      />
    </View>
  );
}
