const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ZipWebpackPlugin = require('zip-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, '../public'), to: path.resolve(__dirname, '../dist') },
    ]),
    new ZipWebpackPlugin({
      path: path.resolve(__dirname, '../'),
      filename: 'dist.zip',
      pathPrefix: '',
    }),
  ],
  stats: 'normal', // 输出所有异常时候打印输出
};
