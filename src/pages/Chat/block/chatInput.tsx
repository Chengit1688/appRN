import {forwardRef, Dispatch, SetStateAction, MutableRefObject} from 'react';
import {TextInput} from 'react-native';
import {View, Button, Text, TouchableOpacity} from 'react-native-ui-lib';
import {useTranslation} from 'react-i18next';
import {pt} from '@/utils/dimension';

function ChatInput(
  {
    inputVal,
    setInputVal,
    sendMessage,
    onChangeInputFocus,
    setSelection,
    placeholder,
    isDisabled,
  }: {
    inputVal: string;
    setInputVal: (val: string) => void;
    sendMessage: () => void;
    onChangeInputFocus: (flag: boolean) => void;
    setSelection: (...args: any[]) => void;
    placeholder: string;
    isDisabled: boolean;
  },
  ref: any,
) {
  const {t} = useTranslation();

  return (
    <View row center>
      <View
        flex
        style={{
          height: pt(47),
          borderWidth: pt(1),
          borderColor: '#F1F1F1',
        }}>
        <TextInput
			autoCapitalize='none'
			autoComplete='off'
			autoCorrect={false}
          returnKeyType={'done'}
          defaultValue={inputVal}
          onChangeText={setInputVal}
          editable={isDisabled ? false : true}
          // onEndEditing={sendMessage}
          onFocus={() => onChangeInputFocus(true)}
          onBlur={() => onChangeInputFocus(false)}
          placeholder={placeholder ? placeholder : t('说点什么...')}
          onSelectionChange={({nativeEvent}) => {
            setSelection(nativeEvent.selection);
          }}
          placeholderTextColor="#B1B1B2"
          style={{
            flex: 1,
            paddingHorizontal: pt(16),
            fontSize: pt(14),
            lineHeight: pt(18),
            textAlignVertical: 'top',
          }}
          ref={ref}
          // numberOfLines={3}
          // multiline={true}
        />
      </View>
      {inputVal.trim().length ? (
        <View
          style={{
            paddingHorizontal: pt(8),
          }}>
          <Button
            label={t('发送')}
            onPress={sendMessage}
            avoidInnerPadding={true}
            avoidMinWidth={true}
            backgroundColor="#7581FF"
            style={{
              height: pt(35),
              width: pt(60),
              borderRadius: pt(8),
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

export default forwardRef(ChatInput);
