// modules
// I changed !
var childProcess = require('child_process')
  , express = require('express')
  , http = require('http')
  , morgan = require('morgan')
  , ws = require('ws')
  , path = require('path')
  , bodyParser = require('body-parser')
  , favicon = require('serve-favicon')
  , pg = require('pg');

// configuration files
var configServer = require('./lib/config/server');

// app parameters
var app = express();
var routes = require('./routes/index');
var newUser = require('./routes/newuser')
app.set('port', configServer.httpPort);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(configServer.staticFolder));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));
app.use('/', routes);
app.use('/newuser', newUser)
// serve index
require('./lib/routes').serveIndex(app, configServer.staticFolder);

// HTTP server
http.createServer(app).listen(app.get('port'), function () {
  console.log('HTTP server listening on port ' + app.get('port'));
});

/// Video streaming section
// Reference: https://github.com/phoboslab/jsmpeg/blob/master/stream-server.js

var STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes
var width = 320;
var height = 240;

// WebSocket server
var wsServer = new (ws.Server)({ port: configServer.wsPort });
console.log('WebSocket server listening on port ' + configServer.wsPort);

wsServer.on('connection', function(socket) {
  // Send magic bytes and video size to the newly connected socket
  // struct { char magic[4]; unsigned short width, height;}
  var streamHeader = new Buffer(8);

  streamHeader.write(STREAM_MAGIC_BYTES);
  streamHeader.writeUInt16BE(width, 4);
  streamHeader.writeUInt16BE(height, 6);
  socket.send(streamHeader, { binary: true });

  console.log('New WebSocket Connection (' + wsServer.clients.length + ' total)');

  socket.on('close', function(code, message){
    console.log('Disconnected WebSocket (' + wsServer.clients.length + ' total)');
  });
});

wsServer.broadcast = function(data, opts) {
  for(var i in this.clients) {
    if(this.clients[i].readyState == 1) {
      this.clients[i].send(data, opts);
    }
    else {
      console.log('Error: Client (' + i + ') not connected.');
    }
  }
};

// HTTP server to accept incoming MPEG1 stream
http.createServer(function (req, res) {
  console.log(
    'Stream Connected: ' + req.socket.remoteAddress +
    ':' + req.socket.remotePort + ' size: ' + width + 'x' + height
  );

  req.on('data', function (data) {
    wsServer.broadcast(data, { binary: true });
  });
}).listen(configServer.streamPort, function () {
  console.log('Listening for video stream on port ' + configServer.streamPort);

  // Run do_ffmpeg.sh from node
  childProcess.exec('../../bin/do_ffmpeg.sh');
});

app.post('http://localhost:8080/', function(req, res){
  console.log(req.body);
  res.send(200);

})
//database connection
var connString = "postgres:@localhost/rcx";

var client = new pg.Client(connString);
client.connect(function(err){
  if(err){
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result){
    if(err){
      return console.error('error running query', err);
    }
    console.log("PostgreSQL is connected: ", result.rows[0].theTime);
    client.end
  });

});
module.exports.app = app;
