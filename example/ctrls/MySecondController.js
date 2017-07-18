/**
 * Created by maxime on 17/07/17.
 */
function MySecondController() {


  this.myAction = function(req, res) {
    res.status(500).send('Second controller');
  }

  this.mySecondAction = function(req, res) {
    res.status(200).send('Its ok 200 po po po');
  }

}

module.exports = new MySecondController();