const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { theme } = require('./exportWebpackConfig');

const IS_DEV = NODE_ENV === 'development';
module.exports = () => {
  let config = [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        modules: {
          localIdentName: IS_DEV ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64]',
        },
      },
    },
    {
      loader: require.resolve('less-loader'),
      options: {
        sourceMap: IS_DEV,
        javascriptEnabled: true,
        modifyVars: theme,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugin: [require('autoprefixer')],
      },
    },
  ];

  return config;
};
