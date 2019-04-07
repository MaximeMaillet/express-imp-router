module.exports = {
  extract,
  generate,
};

function extract(configAll) {
  debug('Start extract middlewares');

  let jsonRoutesConfig = null;
  for(let i in configAll) {
    if(typeof configAll[i].routes === 'object') {
      jsonRoutesConfig = configAll[i].routes;
    } else {
      jsonRoutesConfig = require(configAll[i].routes);
    }

    routes = routes.concat(routeExtractor.route(configAll[i], jsonRoutesConfig, isDebug));
  }
  debug('Extract routes : done');
  return routes;
}

function generate() {

}