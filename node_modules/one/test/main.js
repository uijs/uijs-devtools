var child_process     = require('child_process'),

    one               = require('../lib'),
    templating        = require('../lib/templating'),
    render            = require('../lib/render'),

    assert            = require('assert'),
    fs                = require('fs'),
    kick              = require('highkick'),


    common            = require('./common'),
    moduleFilenames   = common.moduleFilenames,
    assertListContent = common.assertListContent;

one.quiet(true);

var test_build     = kick('./build'),
    test_package   = kick('./package'),
    test_manifest  = kick('./manifest'),
    test_npmignore = kick('./npmignore');

function clean(){
  var callback = arguments[ arguments.length - 1 ],
      rm = child_process.exec('rm -rf tmp/* & mkdir tmp');

  rm.on('exit', function(){
    callback && callback();
  });
}

function test_assertListContent(callback){
  assert.ok(assertListContent([3,1,4],[4,3,1]));
  assert.ok(!assertListContent([3,[1],4],[4,3,[1]]));
  assert.ok(!assertListContent([3,1,4],[3,1,6]));
  assert.ok(!assertListContent([3,1,4],[3,1,4,6]));
  callback();
}

function test_build_debug(callback){
  common.build('tmp/built_debug.js', ['--debug'], function(exitCode){
    var ep  = require('../tmp/built_debug'),
        now = ep.main().now;

    assert.equal( ep.debug, true);

    setTimeout(function(){
      assert.ok( ep.main().now > now );
      callback();
    }, 10);
  });
}

function test_build_console(callback){
  common.build('tmp/built_console.js', ['--sandbox-console'], function(exitCode){

    var ep  = require('../tmp/built_console'),
        a = ep.main();

    assert.equal(ep.stdout(), 'Elle creuse encore, cette vieville amie au regard fatigué.\n');
    ep.lib.process.stdout.content = '';

    assert.ok(a.console != console);

    assert.equal(ep.stdout(), '');
    assert.equal(ep.stderr(), '');

    a.console.log('foo');
    assert.equal(ep.stdout(), 'foo\n');

    a.console.info('bar');
    assert.equal(ep.stdout(), 'foo\nbar\n');

    a.console.warn('foo');
    assert.equal(ep.stderr(), 'foo\n');
    a.console.error('bar');
    assert.equal(ep.stderr(), 'foo\nbar\n');

    callback();
  });
}

function test_dependencies(callback){
  one.manifest('example-project/package.json', function(error, manifest){

    if(error){
      callback(error);
      return;
    }

    one.pkg.construct({ 'manifest': manifest, 'wd': 'example-project/' }, function(error, pkg1){


      one.dependencies(pkg1, { 'exclude':['exclude'] }, function(error, deps){
        if(error){
          callback(error);
          return;
        }

        assert.equal(deps.length, 3);
        assert.ok(assertListContent( deps.map(function(el){ return el.name; }), ['dependency', 'sibling', 'assert']));

        var dependency = deps.filter(function(el){ return el.name == 'dependency' })[0];
        assert.equal(dependency.dependencies[0].name, 'subdependency');

        assert.equal(dependency.dependencies[0].parents[0], deps[0]);

        callback();

      });

    });

  });
}

function test_dependencies_in_parent_dir(callback){
  var pkg = {
    'name':'dependency',
    'manifest':{
      'dependencies':{
        'subdependency':'*',
        'sibling':'*'
      }
    },
    'wd':'example-project/node_modules/dependency',
    'pkgdict':{}
  };

  one.dependencies(pkg, {}, function(error, deps){
    if(error){
      callback(error);
      return;
    }

    try {
      assert.equal(deps.length, 2);
      assert.ok(assertListContent( deps.map(function(el){ return el.name; }), ['subdependency', 'sibling']));

      callback();
    } catch(exc) {
      callback(exc);
    }

  });
}

function test_id(callback){
  var i = templating.id();
  assert.equal(typeof i, 'number');
  assert.equal(templating.id(), i+1);

  callback();
}


function test_modules(callback){
  one.modules({ 'name':'example-project', 'ignore':['lib/ignore'], 'dirs':{'lib':'lib'}, 'wd':'example-project/' }, {}, function(error, modules){

    if(error){
      callback(error);
      return;
    }

    assert.ok(assertListContent(moduleFilenames(modules), ['a.js', 'b.js','web.js']));

    one.modules({ 'name': 'subdependency', 'manifest':{ 'main':'i' }, 'wd':'example-project/node_modules/dependency/node_modules/subdependency/' }, {}, function(error, modules){

      if(error){
        callback(error);
        return;
      }

      assert.ok(assertListContent(moduleFilenames(modules), ['i.js']));
      callback();
    });

  });

}


function test_filterFilename(callback){

  var legalPaths = ['foo.js','lib/bar/qux.js','lib/qux/quux.js','node_modules/foo/lib/bar.js'],
      illegalPaths = ['lib/foo','lib/qux.j'];

  for(var i = -1, len=legalPaths.length; ++i < len; ){
    assert.ok(one.modules.filterFilename(legalPaths[i]));
  };

  for(var i = -1, len=illegalPaths.length; ++i < len; ){
    assert.ok(!one.modules.filterFilename(illegalPaths[i]));
  };

  callback();
}

function test_loadModule(callback){
  one.modules.loadModule('example-project/lib/a.js', function(error, module){
    try {
      assert.equal(module.name, 'a');
      assert.equal(module.filename, 'example-project/lib/a.js');
      assert.equal(module.content.substring(0,7), 'console');
      callback();
    } catch(err){
      callback(err);
    }
  });
}

function test_moduleName(callback){
  assert.equal(one.modules.fixname('foo.js'),'foo');
  assert.equal(one.modules.fixname('foo/bar/qux.js'),'qux');
  assert.equal(one.modules.fixname('foo'));
  assert.equal(one.modules.fixname('foo/bar/qux'));
  assert.equal(one.modules.fixname('foo.js/bar.js/qux'));
  assert.equal(one.modules.fixname('foo.js/bar.js/qux.js.'));
  assert.equal(one.modules.fixname('qux/quux/c-orge.js'),'c-orge');
  callback();
}

function test_renderPackage(callback){
  throw new Error('not implemented');
}

function test_makeVariableName(callback){
  assert.equal(templating.makeVariableName('fooBar'), 'foobar');
  assert.equal(templating.makeVariableName('foo bar'), 'fooBar');
  assert.equal(templating.makeVariableName('foo BAR'), 'fooBar');
  assert.equal(templating.makeVariableName('foo$bar-qux'), 'fooBarQux');
  assert.equal(templating.makeVariableName('foo bar-=-qux'), 'fooBarQux');
  assert.equal(templating.makeVariableName('foo_bar'), 'fooBar');
  assert.equal(templating.makeVariableName('3.14foo15Bar9'), 'foo15bar9');
  callback();
}

function test_flattenPkgTree(callback){
  var ids = [1,2,3,4,5,6,9,7,8],
      map = {
        pkgdict: {
          'corge': 0,
          'foo': 1,
          'bar': 2,
          'quux': 3
        }
      };

  var flat = render.flattenPkgTree(map);
  assert.equal(flat.length, 4);

  var i = 4;
  while( i -- ){
    assert.equal(flat[i], i);
  }

  callback();
}

module.exports = {
  'init': clean,
  'test_package': test_package,
  'test_manifest': test_manifest,
  'test_dependencies':test_dependencies,
  'test_dependencies_in_parent_dir': test_dependencies_in_parent_dir,
  'test_modules':test_modules,
  'test_filterFilename':test_filterFilename,
  'test_flattenPkgTree':test_flattenPkgTree,
  'test_id':test_id,
  'test_loadModule':test_loadModule,
  'test_makeVariableName':test_makeVariableName,
  'test_moduleName':test_moduleName,
  'test_assertListContent':test_assertListContent,
  'test_build':test_build,
  'test_build_debug':test_build_debug,
  'test_build_console':test_build_console,
  'test_npmignore': test_npmignore
};
