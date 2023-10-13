import {useState} from 'react';
import {View} from 'react-native-ui-lib';
import Svg, {
  SvgUri,
  SvgCssUri,
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';
import SvgLogo from '@/assets/demo/logos/autocode.svg';

const TestSvg = (props: any) => {
  const [svgUrl, setSvgUrl] = useState(
    'http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg',
  );

  const [loading, setLoading] = useState(true);
  const onError = (e: Error) => {
    setLoading(false);
  };
  const onLoad = () => {
    //console.log('Svg loaded!');
    setLoading(false);
  };

  return (
    <>
      <View style={{flexWrap: 'wrap'}} row padding-s1 bg-red30>
        <SvgLogo width={120} height={120} />

        <SvgCssUri
          width="100"
          height="100"
          uri="https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg"
          onError={onError}
          onLoad={onLoad}
        />

        <SvgUri
          width="100"
          height="100"
          uri="http://thenewcode.com/assets/images/thumbnails/homer-simpson.svg"
        />

        <Svg height="100" width="100" viewBox="0 0 100 100">
          <Circle
            cx="50"
            cy="50"
            r="45"
            stroke="blue"
            strokeWidth="2.5"
            fill="green"
          />
          <Rect
            x="15"
            y="15"
            width="70"
            height="70"
            stroke="red"
            strokeWidth="2"
            fill="yellow"
          />
        </Svg>
      </View>
    </>
  );
};

export default TestSvg;
