var express = require('express')
    , router = express.Router()
    , pg = require('pg')
    , connString = "postgres:@localhost/rcx"
    , client = new pg.Client(connString)
    , bcrypt = require('bcrypt')
    , session = require('express-session');

router.post('/', function (req, res, next) {
  var sess = req.session
  var username = req.body['newuser[username]']
  var email = req.body['newuser[email]']
  pg.connect(connString, function (err, client, done) {
    if(err) return console.log(err);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body['newuser[password]'], salt);
    var query = client.query("INSERT INTO users(username, salt, passhash, email) VALUES($1, $2, $3, $4)", [username, salt, hash, email]);
    query.on('end', function(){
      done();
      sess.username = username
      res.send(200, {success: sess.username })
    });

  });
});

module.exports = router;
