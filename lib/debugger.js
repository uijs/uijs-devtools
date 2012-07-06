var express = require('express');
var path = require('path');
var socketio = require('socket.io');
var fs = require('fs');

module.exports = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  options.port = options.port || 5000;
  options.outdir = options.outdir || path.join(process.cwd(), 'dist');
  options.js = options.js || path.join(options.outdir, 'index.js');

  console.log('starting debugger for', options.js);

  var server = express.createServer();

  // serve debugger client
  server.use(express.static(path.join(__dirname, '..', 'public')));
  
  // stream build outputs via /debugger/target.[js|html]
  server.use('/debugger/target.js', function(req, res) { return fs.createReadStream(options.js).pipe(res); });
  server.use('/debugger/target.html', function(req, res) { return fs.createReadStream(options.html).pipe(res); });
  
  // stream everything under /dist as static content.
  server.use('/dist', express.static(options.outdir));

  // create socketio server for logs
  var io = socketio.listen(server, { 'log level': 1 });
  io.sockets.on('connection', function (socket) {
    socket.on('log', function(line) {
      line.args.unshift('[' + new Date(line.time).toISOString() + ']');
      console.log.apply(console, line.args);
    });
  });

  // start server
  console.log('uijs debugger listening on port ' + options.port);
  server.listen(options.port, callback);
};