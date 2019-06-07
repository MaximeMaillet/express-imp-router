# Static routes

Static route can serve static files like CSS or HTML files.

```javascript
router.route([{
  routes: {
    '/public': {
      '_static_': {
        'targets': ['example/public', 'example/media'],
      }
    }
  }
}]);
```

In `targets`, we fund a list of available directory from root directory.