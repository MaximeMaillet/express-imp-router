## Releases 0.3.0 - Refacto

* Route's configuration accept path of json file or json object

* Route JSON object standard
  * Should start with route
  * Should continue with method or with sub route
  * Then configure your route with
       * String : `MyController#MyAction`
       * Object
       * Function

* Default handler for error like not found or errors throwed by user

* Handle middlewares