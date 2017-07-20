var dateFormat = require('date-format');
var colors = require('colors');
var emoji = require('node-emoji');
var express = require('express');

var RouterPublic = {

  getRoutes: function(route) {
    // @todo
  }
};

var RouterPrivate = {
  errorRoutes: [],
  /**
   * Initialize routing
   */
  initialize: function() {
    this.checkOptions();
    this.checkArguments();
    this.extractRoutes(require(Router.options.routes), function() {
      var columnify = require('columnify');
      var columns = columnify(Router.generatedRoutes);
      console.log(columns);
    });
  },
  /**
   * Check options
   */
  checkOptions: function() {
    Router.options.framework = Router.options.framework || 'Express';
    Router.controllersDirectory = Router.options.controllers || this.findControllers();
    if(!Router.controllersDirectory.endsWith('/')) {
      Router.controllersDirectory += '/';
    }
  },
  /**
   * Check argument for debug
   */
  checkArguments: function() {
    var root = this;
    process.argv.forEach(function (val, index, array) {
      if(val.startsWith('-v')) {
        root.debug = true;
      }
    });
  },
  /**
   * Extract route from JSON file
   * @param configRoutes
   * @param callbackEnd
   */
  extractRoutes: function(configRoutes, callbackEnd) {
    var root = this;
    Object.keys(configRoutes).map(function(routes, index) {

      if(typeof routes !== 'string') {
        throw new Error('Route must be string not ('+routes+')');
      }

      if(routes.startsWith("/")) {
        root.parseRoutes(routes, configRoutes[routes]);
      }
      else if(routes === "404") {
        root.parseErrorRoutes(routes, configRoutes[routes]);
      }
      else {
        throw new Error('Route must be start with slash (/'+routes+' not '+routes+')');
      }
    });

    Router.private.generateErrorRoutes();
    callbackEnd();
  },
  /**
   * Analyze config and parse route
   * @param parentRoute
   * @param config
   */
  parseRoutes: function(parentRoute, config) {
    var obj = Object.keys(config);
    var root = this;
    var methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'HEAD', 'CONNECT', 'OPTIONS', 'TRACE'];
    if(Router.options['methods'] !== undefined) {
      methods.concat(Router.options['methods']);
    }

    obj.map(function(key) {
      if(key.startsWith('/')) {
        root.parseRoutes(parentRoute+key, config[key]);
      }
      else if(key.startsWith('static')) {
        root.generateStatic(parentRoute, config[key]);
      }
      else if(methods.indexOf(key.toUpperCase()) !== -1) {
        root.generateRoute(key, parentRoute, config[key]);
      }
      else {
        throw new Error('Syntax malformed : ('+key+')');
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
    if(options !== undefined && options.controllersDirectory !== undefined) {
      Router.controllersDirectory = options.controllersDirectory;
    }

    var controllersFinder = require('./lib/controllers');
    var ctrl = controllersFinder(Router.controllersDirectory, action);

    Router.generatedRoutes.push({
      status: emoji.get(':white_check_mark:')+"  Route generated".green+" : ",
      method: method.toUpperCase(),
      route: route,
      controller: action
    });

    Router.options.express[method.toLowerCase()](route, function(req, res) {
      ctrl.getAction([req, res, Router.public]);
    });
  },
  /**
   * Generate static route
   * @param route
   * @param directory
   */
  generateStatic: function(route, directory) {
    Router.generatedRoutes.push({
      status: emoji.get(':white_check_mark:')+"  Route generated".green+" : ",
      method: 'STATIC',
      route: route,
      controller: directory
    });

    Router.options.express.use(route, express.static(directory));
  },
  /**
   * Parse route errors
   * @param status
   * @param action
   */
  parseErrorRoutes: function(status, action) {
    this.errorRoutes.push({
      action: action,
      status: status
    })
  },
  /**
   * Generate error routes
   */
  generateErrorRoutes: function() {
    var controllersFinder = require('./lib/controllers');
    var ctrl;
    for(var i=0; i<this.errorRoutes.length; i++) {
      ctrl = controllersFinder(Router.controllersDirectory, this.errorRoutes[i]['action']);

      Router.generatedRoutes.push({
        status: emoji.get(':white_check_mark:')+"  Route generated".green+" : ",
        method: this.errorRoutes[i]['status'],
        route: '*',
        controller: this.errorRoutes[i]['action']
      });

      Router.options.express.use(function(req, res, next) {
        ctrl.getAction([req, res, next]);
      });
    }
  },


  /**
   * Find controllers directory
   */
  findControllers: function() {
    // @TODO
  }
};

function headerLogs(req, res) {
  var oldWrite = res.write;
  var end = res.end;
  var chunks = [];

  var logs;

  res.write = function (chunk) {
    chunks.push(chunk);
    oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) {
      chunks.push(chunk);
    }

    var statusCode = res.statusCode.toString();
    statusCode = statusCode.startsWith('2') || statusCode.startsWith('3') ? statusCode.green : statusCode.red;
    logs = "["+dateFormat('yyyy-MM-dd hh:mm:ss', new Date())+"] "+req.method+" "+req.url + " > "+statusCode;

    if(Buffer.isBuffer(chunks)) {
      logs += ' :: '+Buffer.concat(chunks).toString('utf8');
    }

    console.log(logs);
    end.apply(res, arguments);
  };
}

/**
 *
 */
var Router = {
  public: RouterPublic,
  private: RouterPrivate,
  options: null,
  controllersDirectory: null,
  generatedRoutes: [],
  debug: false,
  isLogActive: true
};

/**
 * Entry point
 * @param _options
 * @returns {Function}
 */
module.exports = function(_options) {
  Router.options = _options;

  Router.options.express.use(function(req, res, next) {

    if(Router.isLogActive) {
      headerLogs(req, res);
    }

    next();
  });

  Router.private.initialize();
};