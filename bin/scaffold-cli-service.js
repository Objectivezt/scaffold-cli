const semver = require('semver');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const { PROJECT_PATH } = require('../config/getPathConfig');

function setEnv(env) {
  if (fs.existsSync(env)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: env,
      }),
    );
  }
}

const rawArgv = process.argv.slice(2);

console.log(rawArgv);
exports.envFn = () => {
  setEnv(`${PROJECT_PATH}/.env.${rawArgv[1] || rawArgv[0]}`);
};
