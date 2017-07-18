## Express IMP-Router

Create your routes file in JSON and redirect to controllers

## Installation

```bash
npm install express-imp-router --save
```

## Usage

```js

var express = require('express');
var app = express();

var router = require('express-router');
router.route(app, __dirname+'/routes.json', {
  controllers: __dirname+'/ctrls'
});


app.listen(6060);
```

## License

##### GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc. <http://fsf.org/>
Everyone is permitted to copy and distribute verbatim copies
of this license document, but changing it is not allowed.