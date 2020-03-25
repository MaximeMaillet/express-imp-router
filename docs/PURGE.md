# You can purge all routes and middlewares

Example :

```
const app = express();
router(app);
router.route([{
  controllers: `${path.resolve('.')}/tests/functionals/data/controllers`,
  middlewares: `${path.resolve('.')}/tests/functionals/data/middlewares`,
  routes: {
    '/': {
      get: 'HomeController#home',
    }
  },
}]);


...

router.route([{
  controllers: `${path.resolve('.')}/tests/functionals/data/controllers`,
  middlewares: `${path.resolve('.')}/tests/functionals/data/middlewares`,
  routes: {
    '/': {
      get: 'MainController#main',
    }
  },
}]);
```

Problem : conflict between HomeController and MainController.

Add `router.purge()` for purge routes charged in memory

```
router.purge();
```