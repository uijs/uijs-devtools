var mock = require('./canvas-mock');
var vm = require('vm');
var fs = require('fs');

module.exports = function(main_path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = options || {};
  options.duration = 'duration' in options ? options.duration : 5000;

  fs.readFile(main_path, function(err, data) {
    if (err) return callback(err);

    var bindings = {
      window: {},
      the_app: null,
    };

    window = {};
    var x = require(main_path);
    var app = window.main;
    var uijs = window.require('uijs');

    var canvas = new mock.HTMLCanvasElement(500, 500);

    // attach uijs to the mock canvas.
    // `paused` is true so that the refresh loop will not begin, so we also need to call `redraw()`.
    var root = uijs.canvasize({ element: canvas, children: [ app ], paused: true });

    var start_time = Date.now();
    var count = 0;
    while (Date.now() - start_time < options.duration) {
      root.redraw();
      count++;
    }

    var fps = count / 5.0;
    return callback(null, fps);    
  });
};