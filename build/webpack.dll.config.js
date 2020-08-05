const path = require('path');
const Webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { PROJECT_PATH } = require('../config/getPathConfig');

const vendors = [
  'react',
  'react-dom',
  'react-router-dom',
  'antd',
  'history',
  'moment',
  'dva',
  'dva-loading',
  'react-app-polyfill/ie11',
  'react-app-polyfill/stable',
];

module.exports = env => {
  env.development ? (process.env.NODE_ENV = 'development') : (process.env.NODE_ENV = 'production');

  const { NODE_ENV } = process.env;
  const IS_DEV = NODE_ENV === 'development' ? true : false;

  return {
    mode: NODE_ENV,
    entry: {
      vendor: vendors,
    },
    devtool: IS_DEV ? 'source-map' : 'none',
    output: {
      path: path.join(PROJECT_PATH, './dll'),
      filename: `[name]${IS_DEV ? '.dev' : ''}.dll.js`,
      library: '[name]_library',
    },
    plugins: [
      new Webpack.DllPlugin({
        path: path.join(PROJECT_PATH, '../dll', `[name]${IS_DEV ? '.dev' : ''}-manifest.json`),
      }),
      !IS_DEV
        ? new UglifyJSPlugin({
            uglifyOptions: {
              warnings: false,
              compress: {
                drop_debugger: true,
                drop_console: true,
              },
            },
          })
        : () => {},
    ],
  };
};
