/**
 *
 * @param ctrlAction
 * @returns {{getAction: getAction, getController: getController}}
 */
module.exports = function(directory, ctrlAction) {
  var control = ctrlAction.split('#');
  var controller = control[0];
  var action = control[1];

  try {
    var objectController = require(directory+controller);
  }
  catch(e) {
    // @todo debug
  }
  var objectAction = null;

  if(typeof objectController === 'object') {
    objectAction = objectController[action];
  }
  else {
    throw new Error('Controller not found');
  }

  if(typeof objectAction !== 'function') {
    throw new Error(action+' is not a function');
  }

  return {
    getAction: function() {
      return objectAction;
    },
    getController: function() {
      return objectController;
    }
  }
}