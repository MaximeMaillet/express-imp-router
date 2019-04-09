# Express IMP-Router

Router for Express.JS

Create your routes file in JSON and redirect each route to controllers.
You can inject middlewares, services and errors handler.
You can configure view engine rendering and give static files.

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
    routes: './routes.json',
    controllers: '/controllers'
  }
]);

app.listen(6060);
```




*./routes.json*
```json
{
  "/articles": {
    "get": "ArticleController#getAll",
    "post": {
      "controller": "ArticleController",
      "action": "add"
    },
    "/:id": {
      "get": "ArticleController#getOne",
      "patch": "ArticleController#setOne"
    }
  }
}
```

*./controllers/ArticleController.js*

```javascript
module.exports = {
  getOne: (req, res) => {
    const id = req.params.id;
    //...
  },
  getAll: (req, res) => {
    //...
  },
  add: (req, res) => {
    // ...
  },
  setOne: (req, res) => {
    const id = req.params.id;
    // ...
  }
}
```

## How to declare route

*From string*
```json
{
  "/route": {
    "get": "MyController#get"
  }
}
```

*From object*
```json
{
  "/route": {
    "get": {
      "controller": "MyController",
      "action": "get"
    }
  }
}
```

*From function*
```javascript
const routes = {
  '/route': {
    get: {
      action: (req, res) => {
        // ...
      }
    }
  },
  '/route2': {
    get: (req, res) => {
      // ...
    }
  }
}
```

## How to declare extra

*Extra are services and middlewares*

... todo