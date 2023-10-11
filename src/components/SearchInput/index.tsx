import {ViewStyle} from 'react-native';
import {View, Icon, TextField} from 'react-native-ui-lib';
import {pt} from '@/utils/dimension';

export type Props = {
  value?: string;
  placeholder?: string;
  onSearch?: (keyword: string) => void;
  onChange?: (keyword: string) => void;
  style?: ViewStyle;
};

export default function SearchInput({
  value,
  placeholder,
  onSearch,
  onChange,
  style,
}: Props) {
  let _style: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    height: pt(45),
    // margin: pt(16),
    paddingLeft: pt(20),
    paddingRight: pt(20),
    borderWidth: pt(1),
    borderRadius: pt(6),
    borderColor: '#E3E3E3',
    backgroundColor: '#F8F8F8',
  };
  _style = {..._style, ...style};
  return (
    <View style={_style}>
      <Icon
        assetName="search"
        assetGroup="icons.compontent"
        size={pt(16)}
        style={{
          marginRight: pt(7),
        }}
      />
      <TextField
	  	autoCapitalize='none'
	  	autoComplete='off'
		autoCorrect={false}
	  	defaultValue={value}
        placeholder={placeholder}
        placeholderTextColor="#B1B1B2"
        containerStyle={{
          flex: 1,
        }}
        onChangeText={value => {
          onChange && onChange(value);
        }}
        onEndEditing={e => {
          const value = e.nativeEvent.text;
          onSearch && onSearch(value);
        }}
      />
    </View>
  );
}
