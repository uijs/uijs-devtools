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

  server.use(express.static(path.join(__dirname, '..', 'public')));
  
  // stream build output via /debugger/target.js
  // the debugger's index.html loads it this way.
  server.use('/debugger/target.js', function(req, res) {
    return fs.createReadStream(options.js).pipe(res);
  });
  
  server.use('/dist', express.static(options.outdir));

  var io = socketio.listen(server, {
    'log level': 1
  });

  io.sockets.on('connection', function (socket) {
    socket.on('log', function(line) {
      console.log('[' + new Date(line.time).toISOString() + '] ' + line.data);
    });
  });

  console.log('uijs debugger listening on port ' + options.port);
  server.listen(options.port, callback);
};