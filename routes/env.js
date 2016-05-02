module.exports = (function() {

  var env = {};
  var cloudant = {};

  env.port = process.env.PORT || 3000;
  env.db = {};

  if (process.env.VCAP_SERVICES) {
    cloudant = JSON.parse(process.env.VCAP_SERVICES);
    cloudant = cloudant.cloudantNoSQLDB[0].credentials || {};
  }

  env.db.hostname = cloudant.host || '127.0.0.1';
  env.db.port = cloudant.port || 5984;
  env.db.username = cloudant.username || 'admin';
  env.db.password = cloudant.password || 'admin';
  env.db.database = 'handson';

  env.getDbUrl = function() {
    var protocolo = env.db.port == 443 ? 'https://' : 'http://';
    return protocolo + env.db.username + ':' + env.db.password + '@' + env.db.hostname + ':' + env.db.port;
  };

  console.log('Configuração: %j', env);
  return env;
}());
