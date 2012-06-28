var child_process = require('child_process');

function assertListContent(a,b){
  return a.length == b.length && a.every(function(el){
    return b.indexOf(el) > -1;
  });
}

function build(target, params, callback){
  var proc = child_process.exec('./bin/onejs build example-project/package.json ' + target + ' ' + params.join(' '));

  proc.on('exit', function(code){
    callback();
  });
}

function moduleFilenames(modules){
  return modules.map(function(el){ return el.filename; });
}


module.exports = {
  'moduleFilenames': moduleFilenames,
  'assertListContent': assertListContent,
  'build': build
}
