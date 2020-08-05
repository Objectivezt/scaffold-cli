const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 构建打点
const clearConsole = require('react-dev-utils/clearConsole');
const webpackBaseConfig = require('./webpack.base.config');

const smp = new SpeedMeasurePlugin();

module.exports = env => {
  clearConsole();
  return env.development
    ? smp.wrap(merge(webpackBaseConfig, require('./webpack.dev.config')))
    : merge(webpackBaseConfig, require('./webpack.build.config'));
};
