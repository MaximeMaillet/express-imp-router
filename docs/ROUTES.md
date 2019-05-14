# Routes

For declare route you can precise `url`, `method`, `controller` and `action`.

*NB: `controller` is a file and `action` is a function inside file*

You have three ways for declare route :

## With string

```javascript
router.route([
  {
    routes: {
      '/': {
        get: 'MyController#MyAction'
      },
      '/second': {
        get: ['MyController#MyAction', 'MyController#MySecondAction']
      }
    }
  }
])
```

## With object

```javascript
router.route([{
  routes: {
    '/': {
      get: {
        controller: 'MyController',
        action: 'MyAction'
      }
    },
    '/second': {
      get: [
        {
          controller: 'MyController',
          action: 'MyAction'
        },
        {
          controller: 'MyController',
          action: 'MySecondAction'
        }
      ]
    }
  }
}]);
```

## With function

```javascript
router.route([{
  routes: {
    '/': {
      get: (req, res, next) => {
        next();
      }
    },
    '/second': {
      get: [
        (req, res, next) => {
          next();
        },
        (req, res, next) => {
          next();
        }
      ]
    }
  }
}]);
```