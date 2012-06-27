var path         = require('path'),
    assert       = require('assert'),

    logging      = require('./logging'),
    id           = require('./id'),
    manifest     = require('./manifest'),
    modules      = require('./modules'),
    dependencies = require('./dependencies');

function construct(context, callback){

  assert.ok(context.manifest);
  assert.ok(context.wd);

  var parents = !context.parents || !context.parents.length ? [] : context.parents;

  !context.parents && context.parent && parents.push( context.parent );

  var struct = {
    'id'           : context.hasOwnProperty('id') && context.id != undefined ? context.id : module.exports.id(),
    'dependencies' : undefined,
    'dirs'         : context.manifest.directories || {},
    'ignore'       : context.ignore,
    'main'         : undefined,
    'manifest'     : context.manifest,
    'modules'      : undefined,
    'modulesDict'  : {},
    'name'         : context.manifest.name,
    'parents'      : parents,
    'pkgdict'      : parents.length ? parents[0].pkgdict : {},
    'wd'           : context.wd
  };

  struct.pkgdict[struct.name] = struct;

  callback(undefined, struct);
}


function content(pkg, options, callback){

  logging.debug('Loading the package "%s"', pkg.manifest.name);

  dependencies(pkg, options, function(error, deps){

    if(error){
      logging.error('An unexpected error occurred during collecting dependencies of the package "'+pkg.name+'".');
      logging.error(error);
      callback(error);
      return;
    }

    logging.debug(''+deps.length+' dependencies has been loaded for the package "'+pkg.name+'"');

    pkg.dependencies = deps;

    modules(pkg, options, function(error, modules){

      if(error){
        logging.error('An unexpected error occurred during collecting modules of the package "'+pkg.name+'".');
        logging.error(error);
        callback(error);
        return;
      }

      logging.debug('Collected '+modules.length+' modules for the package "'+pkg.name+'"');

      pkg.modules = modules;

      var i = modules.length, m, mainModulePath;

      while(i-->0){
        m = modules[i];
        pkg.modulesDict[m.path] = m;
      }

      if(pkg.manifest.main){
        mainModulePath = path.join(pkg.wd, pkg.manifest.main + ( /\.js$/.test(pkg.manifest.main) ? '' : '.js' ));

        pkg.main = pkg.modulesDict[mainModulePath];

        pkg.mainModuleId = pkg.main.name;
      }

      logging.info('%s loaded.', pkg.name);

      callback(error, pkg);
    });

  });
}

function main(options, buildOptions, callback){

  var manifestPath;

  typeof options == 'string'
    && ( manifestPath = options, options = { 'manifestPath': manifestPath } )
    || ( manifestPath = options.manifestPath );

  logging.trace('Building the package at "%s"', manifestPath);

  manifest(manifestPath, function(error, manifestObj){

    if(error){
      callback(error);
      return;
    }

    construct({ 'manifest': manifestObj, 'ignore':options.ignore, 'wd': path.normalize(path.dirname(manifestPath)), 'parents': options.parents, 'parent': options.parent }, function(error, pkgobj){

      if(error){
        callback(error);
        return;
      }

      content(pkgobj, buildOptions, callback);

    });

  });
}

module.exports = main;
module.exports.id = id();
module.exports.content = content;
module.exports.construct = construct;

