var browserify = require('browserify');
var uglify = require('uglify-js');
var fs = require('fs');
var async = require('async');
var mkdirp = require('mkdirp');
var path = require('path');
var ncp = require('ncp').ncp;
var exec = require('child_process').exec;

module.exports = function(options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (typeof options === 'string') {
    options = { main: options };
  }

  options = options || {};
  
  // alias `options.package` with `options.main`
  if (options.package) {
    options.main = options.package;
    delete options.package;
  }

  var debug  = 'debug'  in options ? options.debug  : true;

  // determine main module

  var main = options.main || 'index.js'; // default main module is index.js

  var verbose = 'verbose' in options ? options.verbose : false;
  var pre     = 'pre' in options ? options.pre : null;

  function determine_outputs(callback) {
    var main_module = path.resolve(main);

    return fs.stat(main_module, function(err, stat) {
      if (err) return callback(err);
      
      // if main is a directory, append `package.json` to it.
      if (stat.isDirectory()) {
        main_module = path.join(main_module, 'package.json');
      }

      if (path.extname(main_module) === '.js') {
        var barename = path.basename(main_module, '.js');
        var appdir = path.dirname(main_module);
        var outdir = 'out' in options ? options.out : path.join(appdir, 'dist');
        return callback(null, {
          type: 'file',
          main_module: main_module,
          appdir: appdir,
          outdir: outdir,
          js: 'js' in options ? options.js : path.join(outdir, barename + '.uijs.js'),
          html: 'html' in options ? options.html : path.join(outdir, barename + '.uijs.html'),
          assets: 'assets' in options ? options.assets : path.join(appdir, 'assets'),
        });
      }
      else if (path.extname(main_module) === '.json') {

        // open the package file and extract the main module path from it.
        return fs.readFile(main_module, function(err, data) {
          if (err) return callback(err);
          var json;
          try { 
            json = JSON.parse(data);
          }
          catch (e) {
            return callback(e);
          }

          json.main = json.main || '.';
          json.main = path.resolve(json.main);

          return fs.exists(json.main, function(exists) {
            if (!exists) {
              json.main += '.js';
            }

            // if `main` points to a directory, append `index.js`.
            return fs.stat(json.main, function(err, stat) {
              if (err) return callback(err);
              if (stat.isDirectory()) {
                json.main = path.join(json.main, 'index.js');
              }

              var appdir = path.dirname(main_module);
              var outdir = 'out' in options ? options.out : path.join(appdir, 'dist');
              return callback(null, {
                type: 'package',
                main_module: json.main,
                appdir: appdir,
                outdir: outdir,
                js: 'js' in options ? options.js : path.join(outdir, 'index.js'),
                html: 'html' in options ? options.html : path.join(outdir, 'index.html'),
                assets: 'assets' in options ? options.assets : path.join(appdir, 'assets'),
              });

            });
          });
        });
      
      }
      else {
        return callback(new Error('Invalid main module file. Main module should be a .js file, a .json file or a packge.json file'));
      }
    });
  }

  return determine_outputs(function(err, outputs) {
    if (err) return callback(err);

    // create build actions based on outputs

    var actions = {};

    function prebuild(cb) {
      if (pre) {
        var child = exec(pre, { cwd: appdir }, function(err) {
          if (err) return cb(err);
          else return cb();
        });
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
      }
      else {
        return cb();
      }
    }

    actions.mkdir = function(dist, cb) {
      return mkdirp(outputs.outdir, function(err) {
        if (err) return cb(err);
        return cb();
      });
    };

    if (outputs.js) {
      actions.js = function(dist, cb) {
        return write(outputs.js, dist, cb);
      };
    }

    if (outputs.html) {
      actions.html = function(dist, cb) {
        return fs.readFile(path.join(__dirname, 'app.shim.html'), function(err, template) {
          if (err) return cb(err);
          var text = template.toString().replace(/\{\{__BUNDLE__\}\}/g, dist);
          return write(outputs.html, text, cb);
        });
      };
    }

    if (outputs.assets) {
      actions.assets = function(dist, cb) {
        return path.exists(outputs.assets, function(exists) {
          if (!exists) return cb();
          return ncp(outputs.assets, path.join(outputs.outdir, 'assets'), function(err) {
            if (err) return cb(err);
            console.log('done');
            return cb();
          });
        });
      };
    }

    return prebuild(function(err) {
      if (err) return callback(err);

      return bundle(outputs.main_module, { debug: debug }, function(err, dist) {
        if (err) return callback(err);

        async.forEach(
          Object.keys(actions), 
          function(name, cb) { 
            return actions[name](dist, function(err) {
              if (err) {
                console.error('[' + name + ']', err);
                return cb(err);
              }
              return cb();
            });
          }, 
          function(err) {
            if (err) console.error(err);
            if (err) return callback(err);
            else return callback(null, {
              outputs: outputs,
              bundle: dist,
            });
          });

      });
    });

  });



  // -- helpers

  function write(filename, data, cb) {
    return fs.writeFile(filename, data, function(err) {
      if (err) return cb(err);
      return cb();
    });
  }

  function bundle(main_module, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    options = options || {};
    var debug = 'debug' in options ? options.debug : true;

    return fs.readFile(path.join(__dirname, 'entry.shim.js'), function(err, shim) {
      if (err) return callback(err);
      var entrypoint_file = path.join(path.dirname(main_module), '.tmp.' + Math.round(Math.random() * 100000) + '.entry.' + path.basename(main, '.js') + '.js');
      shim = shim.toString().replace(/\{\{__MAIN_MODULE__\}\}/g, './' + path.basename(main_module));

      return fs.writeFile(entrypoint_file, shim, function(err) {
        if (err) return callback(err);

        var bundler = browserify({
          filter: !debug ? uglify : null,
          // debug: debug,
        });

        bundler.addEntry(entrypoint_file);

        var bundle = bundler.bundle();

        return fs.unlink(entrypoint_file, function(err) {
          return callback(null, bundle);
        });
      });
    });
  }
};