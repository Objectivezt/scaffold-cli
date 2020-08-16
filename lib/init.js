const chalk = require('chalk');
const path = require('path');
const fse = require('fs-extra');
const { log } = console;
const ora = require('ora');
const inquirer = require('inquirer');
const download = require('./download');
const { dirname } = require('path');

async function init(projectName, options) {
  const { component } = options;
  const cwd = options.cwd || process.cwd();
  const targetDir = path.resolve(cwd, projectName);
  const dirName = `${component} ? '组件模版'： '项目模版'`;

  // 检查是否存在
  if (fse.pathExistsSync(targetDir)) {
    const { ok } = await inquirer.prompt([
      {
        name: 'ok',
        type: 'confirm',
        message: `${chalk.yellow(projectName)} ${dirName} 目录已存在, 是否覆盖`,
      },
    ]);
    if (!ok) {
      process.exit(1);
    } else {
      fse.emptyDirSync(targetDir);
    }
  }

  if (fse.pathExistsSync(path.resolve(cwd, 'package.json'))) {
    log(chalk.red(`\n 不允许在${dirname}中初始化\n`));
    process.exit(1);
  }

  const spinner = ora().start(`${dirName}初始化中`);
  // TODO
  const componentUrl = '';
  // TODO
  const projectUrl = '';
  await download(`direct: ${component ? componentUrl : projectUrl}`, `${projectName}`);
  let currentPackageJson = require(path.resolve(cwd, `${projectName}/package.json`));
  currentPackageJson.name = projectName;
  currentPackageJson.description = projectName;

  fse.outputFileSync(`${projectName}/package.json`, JSON.stringify(currentPackageJson, null, 2));
  spinner.succeed(`${dirName} 初始化完成`);
  process.exit(1);
}

module.exports = (...args) => {
  return init(...args).catch((err) => {
    log(chalk.red(err));
    process.exit(1);
  });
};
