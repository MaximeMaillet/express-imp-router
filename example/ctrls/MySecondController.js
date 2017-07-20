/**
 * Created by maxime on 17/07/17.
 */
function MySecondController() {

  this.test = function(req, res, router) {
    res.send({message: 'ok'});
  };

  this.myAction = function(req, res, router) {

    res.send({message: 'second'});
  }

  this.mySecondAction = function(req, res) {
    res.status(200).send('Its ok 200 po po po');
  }

  this.broken = function(req, res) {
    res.status(404).send('BROKEN');
  }

}

module.exports = new MySecondController();