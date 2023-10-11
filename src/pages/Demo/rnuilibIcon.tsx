import {Assets, Icon, View} from 'react-native-ui-lib';

export default function RnuilibIcon() {
  return (
    <View>
      <Icon source={Assets.icons.search} />
      <Icon source={Assets.icons.check} />
      <Icon source={Assets.icons.checkSmall} />
      <Icon source={Assets.icons.plusSmall} />
      <Icon source={Assets.icons.x} />
    </View>
  );
}
