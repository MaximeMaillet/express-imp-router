/**
 * Created by maxime on 17/07/17.
 */
function MySecondController() {


  this.myAction = function(req, res) {
    res.send('Second controller');
  }

}

module.exports = new MySecondController();