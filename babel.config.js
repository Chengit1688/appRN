let plugins = [
  [
    'babel-plugin-root-import',
    {
      paths: [
        {
          rootPathSuffix: './src',
          rootPathPrefix: '@/',
        },
      ],
    },
  ],
  'react-native-reanimated/plugin',
];
if (
  process.env.NODE_ENV === 'production' ||
  process.env.BABEL_ENV === 'production'
) {
  plugins.push([
    'transform-remove-console',
    {exclude: ['error', 'warn', 'info']},
  ]);
}
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins,
};
