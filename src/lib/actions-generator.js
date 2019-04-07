const fs = require('fs');
const path = require('path');

module.exports = {
  generate,
  generateStatic,
};

function findController(path, file) {
  if(fs.existsSync(path+file+'.js')) {
    return path+file+'.js';
  }

  const files = fs.readdirSync(path);
  for(let i in files) {
    if(fs.lstatSync(path+files[i]).isDirectory()) {
      return findController(path+files[i]+'/', file);
    }
  }

  return null;
}

function generateStatic(route) {
  const dirPath = path.resolve('.')+'/'+route.action;
  if(!fs.existsSync(dirPath)) {
    throw new Error(`This path does not exists : ${dirPath}`);
  }

  route.action = dirPath;
  route.debug.action = dirPath;
  return route;
}

function generate(route) {
  const controllerPath = findController(route.controllerPath, route.controller);

  if(!controllerPath) {
    throw new Error(`${route.controller} does not exists`);
  }

  const controller = require(controllerPath);
  route.controllerPath = controllerPath;
  route.controllerName = route.controller;
  route.controller = controller;

  if(typeof controller === 'object') {
    let action = controller[route.action];

    if(typeof action !== 'function') {
      throw new Error(`${route.action} is not a function`);
    }

    route.actionName = route.action;
    route.action = action;
  }

  return route;
}