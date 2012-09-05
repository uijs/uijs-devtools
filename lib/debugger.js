var express = require('express');
var path = require('path');
var socketio = require('socket.io');
var fs = require('fs');
var http = require('http');

module.exports = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  options.port = options.port || 5000;
  options.outdir = options.outdir || path.join(process.cwd(), 'dist');
  options.js = options.js || path.join(options.outdir, 'index.js');

  var server = express();

  server.use(express.logger());

  // stream build outputs via /debugger/target.[js|html]
  server.use('/', express.static(options.outdir));
  server.use('/', function(req, res) { return fs.createReadStream(options.html).pipe(res); });
  server.use('/debugger/target.js', function(req, res) { return fs.createReadStream(options.js).pipe(res); });
  server.use('/debugger/target.html', function(req, res) { return fs.createReadStream(options.html).pipe(res); });
  
  // create socketio server for logs
  var io = socketio.listen(http.createServer(server), { 'log level': 1 });
  io.sockets.on('connection', function (socket) {
    socket.on('log', function(line) {
      line.args.unshift('[' + new Date(line.time).toISOString() + ']');
      console.log.apply(console, line.args);
    });
  });

  // start server
  server.listen(options.port, function() {
    return callback(null, options.port);
  });
};