#!/usr/bin/env node

const chalk = require('chalk');
const semver = require('semver');
const minimist = require('minimist');
const requiredVersion = require('../package.json').engines.node;
const didYouMean = require('didyoumean');
const commander = require('commander');
const { program } = require('commander');

const { log } = console;

didYouMean.threshold = 0.6;

/**
 * @description 检查node版本
 * @param {*} wanted
 * @param {*} id
 */
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    log(
      chalk.red(`You are using Node${process.version},but this version of ${id} requires Node ${wanted} \n
      please upgrade your Node version.
    `),
    );
  }
}

/**
 * @description 多余参数提示
 * @param {*} index
 * @param {*} length
 */
function extraParams(index, length) {
  if (minimist(process.argv.slice(index)._.length > length)) {
    log(chalk.yellow('多余参数将被忽略'));
  }
}

/**
 * @description
 * @param {string} string
 */
function cmdFormat(string) {
  return string.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

/**
 * @description 清除多余参数
 * @param {*} params
 */
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach((item) => {
    const key = cmdFormat(item.replace(/^--/, ''));
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key];
    }
  });
  return args;
}

function suggestCommands(unKnowCommand) {
  const availableCommands = program.commands.map((item) => item._name);
  const suggestion = didYouMean(unKnowCommand, availableCommands);
  if (suggestion) {
    log(chalk.red(`您是不是想要输入 ${chalk.yellow(suggestion)}?`));
  }
}

checkNodeVersion(requiredVersion, '@scaffold/cli');

if (semver.satisfies(process.version, '9.x')) {
  log(
    chalk.red(
      `You are using Node ${process.version}.\n  Node.js 9.x has already reached end-of-life`,
    ),
  );
}

commander
  .version(`@scaffold/cli ${require('../package.json').version}`)
  .usage('<command> [option]');

commander
  .command('init <app-name>')
  .description('初始化项目模版组件模版')
  .option('-c', '--component', '创建组件模版')
  .action((name, cmd) => {
    const reg = /^[a-zA-Z][a-zA-Z0-9_]*[a-zA-Z0-9]/;
    if (!reg.test(name)) {
      log(
        `${chalk.red('<app-name>')}${chalk.yellow(
          '只允许中文英文数字-_, 并且只能以字母开头，字母或者数字结尾。',
        )}`,
      );
      process.exit(1);
    }
    const options = cleanArgs(cmd);
    extraParams(3, 1);
  });

commander
  .command('update')
  .description('项目包升级')
  .option('-c --component', '升级创建组件模版')
  .action((item) => {
    const options = cleanArgs(cmd);
    extraParams(2, 1);
    require('../lib/update')(options);
  });

commander.command('<command>').action((item) => {
  commander.outputHelp();
  log(`${chalk.red(`错误命名${chalk.yellow(item)}`)}`);
  suggestCommands(item);
});

commander.on('--help', () => {
  log();
  log(`运行 ${chalk.cyan(`scaffold-cli <command> --help`)} 了解详细命令`);
  log();
});

commander.commands.forEach((item) => item.on('--help', () => log()));

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
