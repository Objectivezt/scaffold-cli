const chalk = require('chalk');
const path = require('path');
const fse = require('fs-extra');
const ora = require('ora');
const { log } = console;
const download = require('./download');
const { dirname } = require('path');

async function update(options) {
  const { component } = options;
  const dirName = `${component ? '组件模版' : '项目'} `;
  const cwd = options.cwd || process.cwd();
  if (!fse.pathExistsSync(path.resolve(cwd, 'package.json'))) {
    log(chalk.yellow(`\n 未检测到${dirName}中package.json文件, 请确认是否在${dirName}中！\n`));
    process.exit(1);
  }
  const componentUrl = '';
  const projectUrl = '';

  await download(`direct: ${component ? componentUrl : projectUrl}`, `temp`);

  const tempDir = path.resolve(cwd, '.temp');
  const tempPackageJson = require(path.resolve(tempDir, './package.json'));
  const currentPackageJson = require(path.resolve(cwd, './package.json'));
  const { devDependencies, scripts, dependencies } = tempPackageJson;
  const mergeJson = Object.assign({}, tempPackageJson, currentPackageJson);
  const packageJsonObject = {
    ...mergeJson,
  };

  packageJsonObject.devDependencies = devDependencies;
  packageJsonObject.scripts = scripts;
  packageJsonObject.dependencies = dependencies;

  if (
    JSON.stringify(currentPackageJson.devDependencies) ===
      JSON.stringify(tempPackageJson.devDependencies) &&
    JSON.stringify(currentPackageJson.dependencies) ===
      JSON.stringify(tempPackageJson.dependencies) &&
    JSON.stringify(currentPackageJson.scripts) === JSON.stringify(tempPackageJson.scripts)
  ) {
    log();
    log(chalk.green('目前是最新版本无需升级,无需升级'));
    log();
    process.exit(1);
  }

  const spinner = ora().start(`${dirName}升级中`);
  fse.outputFile(`${cwd}/package.json`, JSON.stringify(packageJsonObject, null, 2), (err) => {
    if (err != null) log(chalk.red(err));
    const files = [
      '.eslintignore',
      '.eslintrc.js',
      '.prettierrc.js',
      '.vscode',
      'public/index.html',
    ];

    files.map((res) => {
      fse.copySync(path.resolve(tempDir, res), path.resolve(cwd, res));
    });

    fse.removeSync(tempDir);
    fse.removeSync(`${cwd}/package-lock.json`);
    fse.removeSync(`${cwd}/node_modules`);
    spinner.succeed(`${dirName}升级完成\n`);
  });
}

module.exports = (...args) => {
  return update(...args).catch((err) => {
    log(chalk.red(err));
    process.exit(1);
  });
};
