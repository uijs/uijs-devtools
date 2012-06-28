var kick = require('highkick'),
    mkdir  = require('fs').mkdir;

function clean(callback){
  mkdir('tmp', 0755, function(){
    callback();
  });
}

function run(){
  clean(function(){

    kick({ module:require('./main'), name:'      main', 'ordered': true }, function(error, result){
      if(error) throw error;
    });

  });
}

run();
