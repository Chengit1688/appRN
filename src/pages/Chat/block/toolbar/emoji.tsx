import {Dispatch, SetStateAction} from 'react';
import {TextInput} from 'react-native';
import {View} from 'react-native-ui-lib';
import EmojiSelector, {Categories} from 'react-native-emoji-selector';
import {pt} from '@/utils/dimension';

export default function Emoji({
  inputVal,
  setInputVal,
}: {
  inputVal: string;
  setInputVal: Dispatch<SetStateAction<string>>;
}) {
  const onSelected = (emoji: string) => {
    setInputVal(inputVal + emoji);
  };

  return (
    <View
      style={{
        height: pt(300),
      }}>
      <EmojiSelector
        showSearchBar={false}
        columns={10}
        category={Categories.emotion}
        onEmojiSelected={onSelected}
      />
    </View>
  );
}
