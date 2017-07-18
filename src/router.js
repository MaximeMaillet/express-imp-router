
module.exports = {
  app: null,
  controllersDirectory: null,
  framework: 'Express',
  generatedRoutes: [],
  route: function(app, routes, options) {
    this.app = app;
    var root = this;
    var configRoutes = require(routes);
    this.framework = options.framework || 'Express';
    this.controllersDirectory = options.controllers || root.findControllers();
    if(!this.controllersDirectory.endsWith('/')) {
      this.controllersDirectory += '/';
    }

    Object.keys(configRoutes).map(function(routes, index) {

      if(typeof routes !== 'string') {
        throw new Error('Route must be string not ('+routes+')');
      }

      if(!routes.startsWith("/")) {
        throw new Error('Route must be start with slash (/'+objectKey+' not '+objectKey+')');
      }

      root.parseRoutes(routes, configRoutes[routes]);
    });

    this.onEnd();
  },
  /**
   * Analyze config and generate routes
   * @param parentRoute
   * @param config
   */
  parseRoutes: function(parentRoute, config) {
    var obj = Object.keys(config);
    var root = this;

    obj.map(function(key) {
      if(key.startsWith('/')) {
        root.parseRoutes(parentRoute+key, config[key]);
      }
      else {
        root.generateRoute(key, parentRoute, config[key]);
      }
    });
  },
  /**
   * Generate one route
   * @param method
   * @param route
   * @param action
   * @param options
   */
  generateRoute: function(method, route, action, options) {
    switch(this.framework) {
      case 'Express':
      default:
        this.generateExpressRoute(method, route, action, options);
    }
  },
  /**
   * Generate route for Express
   * @param method
   * @param route
   * @param action
   * @param options
   */
  generateExpressRoute: function(method, route, action, options) {
    var colors = require('colors');
    var controllersFinder = require('./lib/controllers');
    var emoji = require('node-emoji');

    var ctrl = controllersFinder(this.controllersDirectory, action);

    this.generatedRoutes.push({
      " ": emoji.get(':white_check_mark:')+"  Route generated".green+" : ",
      method: method.toUpperCase(),
      route: route,
      controller: action
    });

    //console.log(("+method.toUpperCase()+")"+route+"\t"+action);
    this.app[method](route, ctrl.getAction);
  },
  /**
   * Find controllers directory
   */
  findControllers: function() {
    // @todo
  },
  onEnd: function() {
    var columnify = require('columnify');
    var columns = columnify(this.generatedRoutes);

    console.log(columns);
  }
};