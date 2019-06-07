# Express IMP-Router

Router for Express.JS

Create your routes file in JSON and redirect each route to controllers.
You can inject middlewares and errors handler.
You can configure view engine rendering and give static files.

## Features

- Manage application's routes at same place

- Add middleware with *method*, level and/or inheritance

- Handle errors and *Not Found* page

- Manage static routes


## Installation

```bash
npm i express-imp-router --save
```

## Usage

*./index.js*
```javascript
const express = require('express');
const router = require('express-imp-router');

const app = express();
router(app);
router.route([
  {
    controllers: './controllers',
    middlewares: './middlewares',
    routes: {
      '/': {
        get: 'HomeController#home'
      }
    },
  }
]);

app.listen(8080);
```

*./controllers/HomeController.js*

```javascript
module.exports = {
  home: (req, res, next) => {
    const id = req.params.id;
    res.send({
      message: 'ok'
    })
  },
}
```

## Contributing

```bash
git clone https://github.com/MaximeMaillet/express-imp-router.git
cd express-imp-router
nvm install
npm install
```

Tests :

```bash
npm test
```
