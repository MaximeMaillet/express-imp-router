# Express IMP-Router

Router for Express.JS

Create your routes file in JSON and redirect to controllers.

## Todo

* Find controller directory by itself
* Generate route from json object

## Releases 0.2.0

* Generate static routes

## Releases 0.1.0

* Generate routes from json file
* Generate erros route with error handler 

## Installation

```bash
npm install express-imp-router --save
```

## Usage

```javascript

const express = require('express');
const router = require('express-imp-router');

const app = express();
router(app);

router.route([
  {
    routes: `${__dirname}/routes.json`,
    controllers: `${__dirname}/controllers`
  }
]);

app.listen(6060);
```