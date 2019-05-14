const fs = require('fs');
const path = require('path');

module.exports = {
  generate,
  generateStatic,
};

function findController(path, file) {
  let controllerName = null;
  if(fs.existsSync(`${path+file}.js`)) {
    return `${path+file}.js`;
  }

  const files = fs.readdirSync(path);

  for(const i in files) {
    if(fs.lstatSync(path+files[i]).isDirectory()) {
      controllerName = findController(`${path+files[i]}/`, file);
      if(controllerName) {
        return controllerName;
      }
    }
  }

  return controllerName;
}

function generateStatic(route) {
  const dirPath = `${path.resolve('.')}/${route.action}`;
  if(!fs.existsSync(dirPath)) {
    throw new Error(`This path does not exists : ${dirPath}`);
  }

  route.action = dirPath;
  route.debug.action = dirPath;
  return route;
}

function generate(route) {
  // let classPath;
  const filePath = findController(route.classPath, route.controller);
  // if(route.find) {
  //   classPath = findController(route.classPath, route.controller);
  // } else {
  //   classPath = route.classPath+route.controller;
  // }

  route.actionName = route.action;
  route.controllerName = route.controller;

  if(!filePath) {
    throw {
      type: 'controller',
      message: `${route.controller} does not exists`,
    };
  }

  const controller = require(filePath);
  // route.controllerPath = filePath;
  route.controller = controller;

  if(typeof controller === 'object') {
    const action = controller[route.action];

    if(typeof action !== 'function') {
      throw {
        type: 'action',
        message: `${route.action} is not a function`,
      };
    }

    route.action = action;
  }

  return route;
}