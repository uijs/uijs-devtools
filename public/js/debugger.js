window.onload = function() {
  var socket = io.connect('http://localhost');
  var uijs = require('uijs');

  console.log(document.getElementById('canvas'));

  var canvas = uijs.canvasize({
    element: document.getElementById('canvas'),
  });

  canvas.add(uijs.rterm(socket));
  canvas.add(app);
};