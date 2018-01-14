'use strict';
const debug = require('debug')('ScrappyScrapper:controllers');

module.exports.extractFromRoute = (controllers, routes) => {

};

/**
 *
 * @param directory
 * @param ctrlAction
 * @returns {{getAction: getAction, getController: getController}}
 */
module.exports.old = function(directory, ctrlAction) {
  const control = ctrlAction.split('#');
  const controller = control[0];
  const action = control[1];

  try {
    var objectController = require(directory+controller);
  }
  catch(e) {
    // @todo debug
  }
  let objectAction = null;

  if(typeof objectController === 'object') {
    objectAction = objectController[action];
  }
  else {
    throw new Error('Controller not found');
  }

  if(typeof objectAction !== 'function') {
    throw new Error(`${action} is not a function`);
  }

  return {
    getAction: function(args) {
      return objectAction.apply(objectController, args);
    },
    getController: function() {
      return objectController;
    }
  };
};