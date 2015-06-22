var express = require('express');
var dgram = require('dgram')
var router = express.Router();



/* GET home page. */


router.get('/', function(req, res, next) {
  res.render('index', { title: 'RCX' });


  // listen for keydown (key)
  //     var message = "key + " dfjsd
          //stuff with message
          //client send

  // var dgram = require("dgram");
  //
  // var server = dgram.createSocket("udp4");
  //
  // server.on("error", function (err) {
  //   console.log("server error:\n" + err.stack);
  //   server.close();
  // });
  //
  // server.on("message", function (msg, rinfo) {
  //   console.log("server got: " + msg + " from " +
  //     rinfo.address + ":" + rinfo.port);
  // });
  //
  // server.on("listening", function () {
  //   var address = server.address();
  //   console.log("server listening " +
  //       address.address + ":" + address.port);
  // });
  //
  // server.bind(5000);
  // // server listening 0.0.0.0:41234
  //
  // // console.log(next);
  //
  // // res.send();/

}).post('/', function(req, res) {
  console.log(req.body.message)
  var PORT = 2000
  var HOST = '192.168.1.2'

  var dgram = require('dgram')
  var message = new Buffer('*OPEN* ' + req.body.message + '\n*CLOS*')
  var client = dgram.createSocket('udp4');
  client.send(message, 0, message.length, PORT, HOST, function(err, bytes){
    if(err) throw err;
    client.close();
  });
  res.end()
});


module.exports = router;
