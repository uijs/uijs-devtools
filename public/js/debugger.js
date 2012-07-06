window.onload = function() {
  var socket = io.connect('http://localhost');
  var uijs = require('uijs');
  var c = uijs.util.constant;

  var canvas = uijs.canvasize({
    element: document.getElementById('canvas'),
  });

  canvas.add(uijs.rterm(socket));
  canvas.add(main);

  main.x = c(0);
  main.y = c(0);
  main.width = canvas.width;
  main.height = canvas.height;
};