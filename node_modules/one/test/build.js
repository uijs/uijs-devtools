var assert            = require('assert'),
    one               = require('../lib'),

    common            = require('./common'),
    assertListContent = common.assertListContent;

function moduleIds(modules){
  return modules.map(function(m){
    return m.id;
  });
}

function init(options, callback){
  common.build('tmp/built.js', ['--tie proc=process,env=process.env', '--exclude exclude'], function(exitCode){
    callback(undefined, require('../tmp/built'));
  });
}

function test_findPkg(mod, callback){
  assert.equal(mod.findPkg('dependency').name, 'dependency');
  assert.equal(mod.findPkg('subdependency').name, 'subdependency');
  assert.equal(mod.findPkg('sibling').name, 'sibling');
  callback();
}

function test_useNativeRequire(mod, callback){
  assert.ok( mod.require('combiner').flatten );
  callback();
}

function test_findModule(mod, callback){
  var g = mod.packages.dependency.modules[1];

  g.id != 'g' && ( g = mod.packages.dependency.modules[0] );

  assert.equal(mod.findModule(mod.packages.dependency.index, 'g'), g);
  callback();
}

function test_globals(mod, callback){
  var globals = mod.require('./a');
  assert.equal(typeof globals.Buffer, 'function');
  assert.ok(globals.process);
  assert.ok(globals.process.env);
  callback();
}

function test_name(mod, callback){
  assert.equal(mod.name, 'exampleProject');
  callback();
}

function test_main(mod, callback){
  assert.equal(mod.main, mod.packages.main.index.call);
  callback();
}

function test_moduleTree(mod, callback){
  assert.ok( assertListContent(moduleIds(mod.packages.main.modules), ['a', 'b', 'web'] ) );
  assert.ok( assertListContent(moduleIds(mod.packages.subdependency.modules), ['i'] ) );
  callback();
}

function test_moduleCtx(mod, callback){
  var pkg = mod.packages.main,
      a, b, web;

  assert.equal(pkg.modules.length, 3);

  var i = pkg.modules.length;
  while(i-->0){
    switch(pkg.modules[i].id){
      case 'a':
        a = pkg.modules[i];
        break;
      case 'b':
        b = pkg.modules[i];
        break;
      case 'web':
        web = pkg.modules[i];
        break;
    }
  }

  assert.equal(a.id, 'a');
  assert.equal(a.pkg.name, 'example-project');
  assert.equal(typeof a.wrapper, 'function');
  assert.ok(a.require);

  var n = mod.packages.sibling.index;

  assert.equal(n.id, 'n');
  assert.equal(n.pkg.name, 'sibling');
  assert.equal(typeof n.wrapper, 'function');

  var g = mod.packages.dependency.modules[ mod.packages.dependency.modules[0].id == 'g' ? 0 : 1 ];

  assert.equal(g.id, 'g');
  assert.equal(g.pkg.name, 'dependency');
  assert.equal(typeof g.wrapper, 'function');

  assertListContent(mod.packages.fruits.index.call(), ['apple', 'orange']);
  assertListContent(mod.packages.vegetables.index.call(), ['tomato', 'potato']);

  callback();
}

function test_packageCtx(mod, callback){
  assert.ok(mod.require);
  assert.equal(mod.name, 'exampleProject');

  assert.equal(typeof mod.stderr(), 'string');
  assert.equal(typeof mod.stdin(), 'string');
  assert.equal(typeof mod.stdout(), 'string');
  assert.equal(mod.stdout(), mod.lib.process.stdout.content);
  assert.equal(mod.stdin(), mod.lib.process.stdin.content);
  assert.equal(mod.stderr(), mod.lib.process.stderr.content);

  var p = mod.packages.main;
  assert.equal(p.name, 'example-project');
  assert.equal(p.id, 1);
  assert.equal(p.parents.length, 0);
  assert.equal(p.mainModuleId, 'a');
  assert.equal(p.index.id, 'a');

  assert.ok( assertListContent(moduleIds(p.modules), ['a', 'b', 'web']) );

  callback();
}

function test_packageTree(mod, callback){

  var main          = mod.packages.main,
      dependency    = mod.packages.dependency,
      sibling       = mod.packages.sibling,
      subdependency = mod.packages.subdependency,
      fruits        = mod.packages.fruits;

  assert.equal( fruits.parents.length, 1 );
  assert.equal( fruits.parents[0], dependency.id );

  assert.equal( subdependency.parents.length, 1 );
  assert.equal( subdependency.parents[0], dependency.id );

  assert.equal( sibling.parents.length, 2 );
  assert.equal( sibling.parents[0], dependency.id );
  assert.equal( sibling.parents[1], main.id );

  assert.equal( dependency.parents.length, 1 );
  assert.equal( dependency.parents[0], main.id );

  assert.equal( main.parents.length, 0 );

  callback();
}

function test_process(mod, callback){
  var proc = mod.lib.process;

  assert.ok(proc);
  assert.equal(typeof proc.Stream, 'function');
  assert.equal(typeof proc.Buffer, 'function');

  assert.equal(proc.binding('buffer').Buffer, proc.Buffer);
  assert.equal(proc.binding('buffer').SlowBuffer, proc.Buffer);

  assert.equal(proc.argv[0], 'onejs');

  assert.ok(proc.env);

  assert.ok(proc.stderr instanceof proc.Stream);
  assert.ok(proc.stdin instanceof proc.Stream);
  assert.ok(proc.stdout instanceof proc.Stream);

  assert.ok(proc.pid == proc.uptime);
  assert.ok(proc.arch == proc.execPath == proc.installPrefix == proc.platform == proc.title == '');

  proc.stdout.write('hello');
  proc.stdout.write(' world');
  assert.equal(proc.stdout.content, 'hello world');

  var isNextTickAsync = false;
  proc.nextTick(function(){
    assert.ok(isNextTickAsync);
    callback();
  });

  isNextTickAsync = true;
}

function test_require(mod, callback){
  assert.ok(mod.require('./b').b);
  assert.ok(mod.require('dependency').f);

  callback();
}

function test_module_caching(mod, callback){
  var now = mod.main().now;
  assert.ok(now > +(new Date)-1000);

  setTimeout(function(){
    assert.equal(mod.main().now, now);
    callback();
  }, 50);
}

function test_parent(mod, callback){
  var a = mod.main(),
      f = a.dependency;

  assert.equal(a.parent, undefined);
  assert.equal(f.parent.id, 'a');

  callback();
}

function test_tie(mod, callback){
  assert.equal(mod.require('proc'), process);
  assert.equal(mod.require('env'), process.env);
  callback();
}

module.exports = {
  'init': init,
  'test_name': test_name,
  'test_packageTree': test_packageTree,
  'test_moduleTree': test_moduleTree,
  'test_packageCtx': test_packageCtx,
  'test_moduleCtx': test_moduleCtx,
  'test_findPkg': test_findPkg,
  'test_findModule': test_findModule,
  'test_require': test_require,
  'test_module_caching': test_module_caching,
  'test_process': test_process,
  'test_globals': test_globals,
  'test_useNativeRequire': test_useNativeRequire,
  'test_main': test_main,
  'test_parent': test_parent,
  'test_tie': test_tie
};
