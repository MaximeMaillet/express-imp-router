var dateFormat = require('date-format');
var colors = require('colors');
var emoji = require('node-emoji');

module.exports = {
  app: null,
  controllersDirectory: null,
  framework: 'Express',
  generatedRoutes: [],
  debug: false,
  isLogActive: true,
  route: function(app, routes, options) {
    this.app = app;
    var root = this;
    var configRoutes = require(routes);

    this.checkArguments();

    this.checkOptions(options);

    this.catchHeaders();

    this.extractRoutes(configRoutes, function() {
      root.onEnd();
    });
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
    var controllersFinder = require('./lib/controllers');
    var ctrl = controllersFinder(this.controllersDirectory, action);

    this.generatedRoutes.push({
      status: emoji.get(':white_check_mark:')+"  Route generated".green+" : ",
      method: method.toUpperCase(),
      route: route,
      controller: action
    });

    this.app[method](route, ctrl.getAction());
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
  },
  checkArguments: function() {
    var root = this;
    process.argv.forEach(function (val, index, array) {
      if(val.startsWith('-v')) {
        root.debug = true;
      }
    });
  },
  checkOptions: function(options) {
    this.framework = options.framework || 'Express';
    this.controllersDirectory = options.controllers || this.findControllers();
    if(!this.controllersDirectory.endsWith('/')) {
      this.controllersDirectory += '/';
    }
  },
  catchHeaders: function() {
    var root = this;
    root.app.use(function(req, res, next) {

      var oldWrite = res.write;
      var end = res.end;
      var chunks = [];

      res.write = function (chunk) {
        chunks.push(chunk);

        oldWrite.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk)
          chunks.push(chunk);

        var body = Buffer.concat(chunks).toString('utf8');
        if(root.isLogActive) {
          var statusCode = res.statusCode.toString();
          statusCode = statusCode.startsWith('2') || statusCode.startsWith('3') ? statusCode.green : statusCode.red;

          console.log(
            "["+dateFormat('yyyy-MM-dd hh:mm:ss', new Date())+"] "+
            req.method+" "+req.url + " > "+statusCode+
            " :: "+body
          );
        }

        end.apply(res, arguments);
      };

      next();
    });
  },
  extractRoutes: function(configRoutes, callbackEnd) {
    var root = this;
    Object.keys(configRoutes).map(function(routes, index) {

      if(typeof routes !== 'string') {
        throw new Error('Route must be string not ('+routes+')');
      }

      if(!routes.startsWith("/")) {
        throw new Error('Route must be start with slash (/'+objectKey+' not '+objectKey+')');
      }

      root.parseRoutes(routes, configRoutes[routes]);
    });

    callbackEnd();
  }
};