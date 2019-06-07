# Middlewares

You can declare middleware from any method and for any use cases.

You have three ways for declare a middleware :

#### With string

```
'/name': {
  [router.IMP.MIDDLEWARE]: {
    controllers: ['user#getName']
  },
  get: 'HomeController#homeName',
}
```

#### With object

```
'/age': {
  [router.IMP.MIDDLEWARE]: {
    controllers: [
      {
        controller: 'user',
        action: 'getAge'
      }
    ]
  },
  get: 'HomeController#homeAge',
},
```

#### With function

```
'/city': {
  [router.IMP.MIDDLEWARE]: {
    controllers: [
      (req, res, next) => {
        req.data = {
          city: 'Lyon, France'
        };
        next();
      }
    ]
  },
  get: 'HomeController#homeCity',
},
```

NB: You can replace `[router.IMP.MIDDLEWARE]` with `_middleware_` but it's advisable to use const.

## Level

You can choose level for each middleware's group. Level allow to put middleware in your global application or for your specified route. You can add middleware error too.

```
'/name': {
  [router.IMP.MIDDLEWARE]: {
    controllers: ['user#getName'],
    level: router.MIDDLEWARE.LEVEL.APP,
  },
  get: 'HomeController#homeName',
}
```

- **router.MIDDLEWARE.LEVEL.APP** (app) : for declare middlewares with route
- **router.MIDDLEWARE.LEVEL.GLOBAL** (global) : for add middleware before route
- **router.MIDDLEWARE.LEVEL.ERROR** (error) : for handle error from your controllers
- **router.MIDDLEWARE.LEVEL.NOT_FOUND** (notfound) : for handle not found routes 

## Inheritance

You can add *inheritance* parameter for apply middleware to your sub-routes.

```
'/name': {
  [router.IMP.MIDDLEWARE]: {
    controllers: ['user#getName'],
    inheritance: router.MIDDLEWARE.INHERITANCE.DESC,
  },
  get: 'HomeController#homeName',
  '/sub-routes': {
    get: 'HomeController#homeNameTwo',  
  }
}
```

## Method

You can choose method for apply middleware only for one route + one method.

```
'/name': {
  [router.IMP.MIDDLEWARE]: {
    controllers: ['user#getName'],
    method: router.METHOD.POST,
  },
  get: 'HomeController#homeName',
  post: 'HomeController#homeNamePost',
}
```
