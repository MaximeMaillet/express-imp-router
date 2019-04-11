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
  let classPath;
  if(route.find) {
    classPath = findController(route.classPath, route.controller);
  } else {
    classPath = route.classPath+route.controller;
  }

  if(!classPath) {
    throw new Error(`${route.controller} does not exists`);
  }

  const controller = require(classPath);
  route.controllerPath = classPath;
  route.controllerName = route.controller;
  route.controller = controller;

  if(typeof controller === 'object') {
    const action = controller[route.action];

    if(typeof action !== 'function') {
      throw new Error(`${route.action} is not a function`);
    }

    route.actionName = route.action;
    route.action = action;
  }

  return route;
}