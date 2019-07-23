# Static routes

Static route can serve static files like CSS files, HTML files or images.

You can redirect your route to one or multiple directory.

```javascript
router.route([{
  routes: {
    '/public': {
      [router.IMP.STATIC]: {
        'targets': ['example/public', 'example/media'],
      }
    }
  }
}]);
```

In `targets`, we found a list of available directory from root directory.