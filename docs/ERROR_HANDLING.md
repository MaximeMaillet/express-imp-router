# Error handling

You can handle error per route or for your whole application

## Error handler

According to express documentatio, yours handling functions should have four parameters with `err` as first and `next` as end. Event if `next` is never used.

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
        '_middleware': {
          'level': router.MIDDLEWARE_LEVEL.ERROR,
          'controller': 'error-handler#handleHtml'
        },
        'get': 'HomeController#home'
      },
      '/api': {
        '_middleware': {
          'level': router.MIDDLEWARE_LEVEL.ERROR,
          'controller': 'error-handler#handleJson'
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
        'get': 'HomeController#home'
      },
      '/*': {
        '_middleware': {
          'level': router.MIDDLEWARE_LEVEL.ERROR,
          'controller': 'error-handler#handleHtml'
        },
      },
      '/api': {
        'get': 'ApiController#get'
      },
      '/api*': {
        '_middleware': {
          'level': router.MIDDLEWARE_LEVEL.ERROR,
          'controller': 'error-handler#handleJson'
        }
      }
    },
  }
]);
```