# Error handling

You can handle error per route or for your whole application

## Error handler

According to express documentation, yours errors handling functions should have four parameters with `err` as first and `next` as end. Event if `next` is never used.

*Error handler example : (error-handler.js)*

```javascript
module.exports.handleHtml = function(err, req, res, next) {
  res.status(400).send('<body><h1>Everything is ok</h1><p>'+err.message+'</p></body>');
}
module.exports.handleJson = function(err, req, res, next) {
  res.status(400).send({
    title: 'Everything is ok',
    message: err.message,
  })
}
```

## Handle for one route

*Routes example : (index.js)*

```javascript
router.route([
  {
    routes: {
      '/': {
        [router.IMP.MIDDLEWARE]: {
          level: router.MIDDLEWARE_LEVEL.ERROR,
          controllers: ['error-handler#handleHtml']
        },
        'get': 'HomeController#home'
      },
      '/api': {
        [router.IMP.MIDDLEWARE]: {
          level: router.MIDDLEWARE_LEVEL.ERROR,
          controllers: ['error-handler#handleJson']
        },
        'get': 'ApiController#get'
      }
    },
  }
]);
```

## Handle for global app

*Routes example : (index.js)*

```javascript
router.route([
  {
    routes: {
      '/': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['error-handler#handleHtml'],
          inheritance: router.MIDDLEWARE.INHERITANCE.DEFAULT,
          level: router.MIDDLEWARE.LEVEL.ERROR,
        },
        get: 'HomeController#home'
      },
      '/api': {
        [router.IMP.MIDDLEWARE]: {
          controllers: ['error-handler#handleJson'],
          inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
          level: router.MIDDLEWARE.LEVEL.ERROR,
        },
        get: 'ApiController#get'
      }
    },
  }
]);
```

Note : This route `/*: { ... }` should be used in last position for catch every errors

## Async / Await

If your controller's action is an async method, you should use `try{...} catch(e){...}` with `next for redirect error to error handler`.

*Example*

```javascript
module.exports.get = async(req, res, next) => {
  try {
    throw new Error('Error');
  } catch(e) {
    next(e);
  }
};
```