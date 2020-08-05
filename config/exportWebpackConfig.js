const { PROJECT_PATH } = require('./getPathConfig');

let PROJECT_CONFIG = null;

try {
  PROJECT_CONFIG = require(`${PROJECT_PATH}/scaffold.config.js`);
} catch (error) {
  PROJECT_CONFIG = {};
}

const { theme } = PROJECT_CONFIG;

exports.theme = theme;
