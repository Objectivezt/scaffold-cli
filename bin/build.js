const Service = require('./service');
const service = new Service();

const { envFn } = require('./scaffold-cli-service');

envFn();

service.run('build').catch(err => {
  console.log(err);
});
