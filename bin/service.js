const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ora = require('ora');
const merge = require('webpack-merge');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin'); // 构建打点
const clearConsole = require('react-dev-utils/clearConsole');
const chalk = require('chalk');

const smp = new SpeedMeasurePlugin();
const { error, warn, log } = console;
module.exports = class Service {
  constructor() {
    this.commands = {
      dev: 'development',
      build: 'production',
    };
  }

  // set env var
  setENV(command) {
    process.env.NODE_ENV = command === 'dev' ? this.commands['dev'] : this.commands['build'];
    process.env.ANALYZER = command === 'analyzer' ? true : false;
  }
  // get webpack config
  getWebpackConfig(command) {
    let config = null;
    if (command === 'dev') {
      process.env.NODE_ENV = 'development';
      config = smp.wrap(
        merge(require('../build/webpack.base.config'), require('../build/webpack.dev.config')),
      );
    } else if (command === 'build') {
      process.env.NODE_ENV = 'production';
      config = merge(
        require('../build/webpack.base.config'),
        require('../build/webpack.build.config'),
      );
    }
    return config;
  }
  // webpack compiler
  webpackCompiler(webpackConfig, command) {
    const { devServer } = webpackConfig;

    if (command === 'dev' && devServer) {
      const { port, host } = devServer;
      const devServerOptions = Object.assign({}, devServer);
      const server = new WebpackDevServer(Webpack(webpackConfig), devServerOptions);
      server.listen(port, host, err => {
        if (err) {
          console.log(err);
        }
      });
    } else {
      Webpack(webpackConfig, (err, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            console.error(err.details);
          }
          return;
        }
        const info = stats.toJson();
        if (stats.hasErrors()) {
          error(info.errors);
        }
        if (stats.hasWarnings()) {
          warn(info.warnings);
        }
      });
    }
  }
  async run(command) {
    this.setENV(command);
    const webpackConfig = this.getWebpackConfig(command);
    this.webpackCompiler(webpackConfig, command);
  }
};
