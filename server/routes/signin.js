var express = require('express'),
    router = express.Router(),
    pg = require('pg'),
    connString = "postgres:@localhost/rcx",
    client = new pg.Client(connString),
    bcrypt = require('bcrypt');


    var connString = "postgres:@localhost/rcx";
router.post('/', function(req, res, next){
  var results = []
  var username = req.body.username
  var password = req.body.password
  pg.connect(connString, function (err, client, done) {
    if(err) return console.log(err);
    var query = client.query("SELECT * FROM users WHERE username = '"+username+"'");
    query.on('row', function(){
      results.push(row)
    });
    query.on('end', function () {
      client.end();
      return isThereUser(results)
    });

  });
  var isThereUser = function(userArray){
    if(userArray.length != 0){
      
    }
  }

})
