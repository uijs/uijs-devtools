window.onload = function() {
  var uijs = require('uijs');
  var constant = uijs.util.constant;

  var main = require('{{__MAIN_MODULE__}}');

  if (!main || !uijs.box.isbox(main)) {
    throw new Error('Main module must export a box')
  }
  
  // -- create canvas

  var canvas = uijs.canvasize();

  // -- add main box to canvas

  main.x = constant(0);
  main.y = constant(0);
  main.width = canvas.width;
  main.height = canvas.height;

  canvas.add(main);

  // -- remote logging

  // try to load socket.io asynchronously from /socket.io/socket.io.js and fail 
  // gracefully if it doesn't exist
  var script = document.createElement('script');
  script.onload = function() {
    if (typeof io !== 'undefined') {
      var socket = io.connect('/');
      canvas.add(uijs.rterm(socket));
    }
  };
  script.onerror = function(e) {
    e.preventDefault();
  };
  script.type = 'text/javascript';
  script.async = true;
  script.src = '/socket.io/socket.io.js';
  document.getElementsByTagName('head')[0].appendChild(script);
};