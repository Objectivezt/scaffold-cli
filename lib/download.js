const download = require('download-git-repo');

module.exports = function (url, dir) {
  return new Promise((resolve, reject) => {
    download(url, dir, (err) => {
      if (err) {
        reject(err);
        process.exit(1);
      } else {
        resolve('ok');
      }
    });
  });
};
