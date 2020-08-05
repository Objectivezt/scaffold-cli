const webpack = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
// const DashboardPlugin = require('webpack-dashboard/plugin');
// const Dashboard = require('webpack-dashboard');

// const dashboard = new Dashboard();

// const openBrowser = require('react-dev-utils/openBrowser')

module.exports = {
  mode: 'development',
  devtool: 'source-map', // 问题排查分析
  watch: true, // 业务文件改动监听
  // 文件改动配置
  watchOptions: {
    aggregateTimeout: 300, // 第一个文件更改后，在重建之前添加一个300延迟。
    poll: 3000, // 每3秒轮询检查更改
    ignored: /node_modules/,
  },
  devServer: {
    host: '127.0.0.1',
    port: 3000,
    disableHostCheck: true,
    inline: true,
    compress: true,
    hot: true,
    historyApiFallback: true,
    overlay: true,
    open: true,
    stats: {
      children: false,
      color: true,
    },
    publicPath: '/',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
    proxy: {
      '/api': {
        target: 'https://cnodejs.org/api/v1',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new ProgressBarPlugin(),
    // new DashboardPlugin(dashboard.setData),
    // HMR 显示 正确文件名
    new webpack.NamedChunksPlugin(),
    // 编译错误时期，输出不包含错误
    new webpack.NoEmitOnErrorsPlugin(),
  ],
};
