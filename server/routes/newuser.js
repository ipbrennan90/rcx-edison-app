var express = require('express');
var router = express.Router();
var pg = require('pg')
var connString = "postgres:@localhost/rcx";
var client = new pg.Client(connString);
var bcrypt = require('bcrypt');

router.post('/', function (req, res, next) {

  pg.connect(connString, function (err, client, done) {
    if(err) return console.log(err);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body['newuser[password]'], salt);
    var query = client.query("INSERT INTO users(username, salt, passhash, email) VALUES($1, $2, $3, $4)", [req.body['newuser[username]'], salt, hash, req.body['newuser[email]']]);
    query.on('end', function(){
      done();
      client.end()
    });

  });
  res.end()
});

module.exports = router;
