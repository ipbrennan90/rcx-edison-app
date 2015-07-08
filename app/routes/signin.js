var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , connString = "postgres:@localhost/rcx"
    , client = new pg.Client(connString)
    , bcrypt = require('bcrypt')
    , session = require('express-session')
    , bodyParser = require('body-parser');


var connString = "postgres:@localhost/rcx";
var sess;
router.post('/', function(req, res, next){
  sess=req.session;
  var results = []
  console.log(req.body)
  var username = req.body['loginuser[username]']
  var password = req.body['loginuser[password]']
  pg.connect(connString, function (err, client, done) {
    if(err) return console.log(err);
    var query = client.query('SELECT * FROM users WHERE username= $1', [username]);
    query.on('row', function(row){
      results.push(row)
    });
    query.on('end', function(){
      done();
      if(results.length != 0){
        if(bcrypt.compareSync(password, results[0]['passhash'])){
          sess.username = username
          res.send(200, {success: sess.username})
        }else{
          res.send(512, {error: "Wrong Password"})
        }
      }else{
        res.send(513, {error: "No User, Please Sign Up"})
      }
    })


  });

})

module.exports = router;
