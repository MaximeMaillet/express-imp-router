## Release 0.5.0 - View Engine


#### To release

* View engine handling

* Param handling (https://expressjs.com/en/4x/api.html#app.param)

* Tests



## Release 0.4.0 - Middleware priority

#### To release

* Add priority for middleware + natural priority when middleware is declared in route children

* Tests


## Release 0.3.2

* Fix bug middleware when you had a middleware in child of "/"

* Refacto string config to variable

* Refacto static route feature + tests



## Release 0.3.1

* Fix middleware level Global error

* Add purge method

* Inheritance for middleware Error and NotFound

* Tests


## Release 0.3.0 - Refacto

* Route's configuration accept path of json file or json object

* Route JSON object standard
  * Should start with route
  * Should continue with method or with sub route
  * Then configure your route with
       * String : `MyController#MyAction`
       * Object
       * Function
       
* Fix vulnerability dependencies

* Multiple configurations

* Deduping + deduping with parameters for strict mode

* Default handler for error like not found or errors throwed by user

* Static routes with *_static_* as method

* Middlewares handing
  
  * Error middleware
  
  * App middleware
  
  * Global middleware

* Not found handling

* Route prefix for each route's config file. 

* Docs

* Examples
