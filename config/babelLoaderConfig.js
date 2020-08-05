const bebelPresets = ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'];

const babelPlugins = [
  [
    'import',
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    },
  ],
  ['@babel/plugin-transform-runtime', { corejs: 2 }],
  [
    '@babel/plugin-proposal-decorators',
    {
      legacy: true,
    },
  ],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-syntax-dynamic-import',
];

module.exports = () => {
  return {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: bebelPresets,
      plugins: babelPlugins,
    },
  };
};
