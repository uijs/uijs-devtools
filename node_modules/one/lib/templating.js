var mustache = require('mustache'),
    boxcars  = require('boxcars'),
    fs       = require('fs'),

    config   = require('./config'),
    logging  = require('./logging'),
    id       = require('./id');

function collection(){
  var coll = {};

  var i = arguments.length,
      filename;

  while( i --> 0 ){
    filename = arguments[i];
    coll[ filename.replace(/\.js$/, '') ] = config.TEMPLATES_DIR + '/' + filename;
  }

  return boxcars(coll);
}

function makeVariableName(str){
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+/g,' ').replace(/^[\d\s]+/g,'').split(' ').reduce(function(a,b){
    return a + b.charAt(0).toUpperCase() + b.slice(1).toLowerCase();
  });
}

function _render(options, callback){
  fs.readFile(config.TEMPLATES_DIR+'/'+options.template, function(error, bf){
    var result;
    if(!error){
      result = mustache.to_html(bf.toString(), options.view, options.partials);w
    }
    callback(error, result);
  });
}

function render(coll){

  return function(/* options, callback */){
    var options, callback = arguments[1];

    if( typeof arguments[0] == 'string' ){
      options = { 'template': arguments[0] };
    } else {
      options = arguments[0];
    }

    coll(function(error, templates){

      if(error){
        callback(error);
        return;
      }

      if( !templates.hasOwnProperty( options.template ) ){
        callback(new Error('Unknown template: "' + options.template + '"'));
        return;
      }

      logging.trace('Rendering template "%s"', options.template);

      var output;

      try {
        output = mustache.to_html(templates[ options.template ], options.view, options.partials);
      } catch (mustacheError) {
        logging.error('Failed to render template "%s"', options.template);
        logging.error(mustacheError);
        callback(mustacheError);
        return;
      }

      callback(undefined, output);

    });

  };

}

module.exports = {
  'collection': collection,
  'id':id(),
  'makeVariableName':makeVariableName,
  'render':render
};
