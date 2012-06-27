OneJS is a command-line utility for converting CommonJS packages to single, stand-alone JavaScript
files that can be run on web browsers.

# Motivation
* **Reusability** OneJS lets developers code JavaScript for one platform and run everywhere, without requiring any additional effort.
* **Elegant Modularization** Modules and packages specs of CommonJS are what web apps exactly needs: a very well designed way to structure JavaScript code.
* **NPM** OneJS moves the revolution of NPM one step forward and makes it available for client-side projects!
* **No Spaghetti Code** No awkward headers, no framework-specific definitions.
* **Reliable code generation** OneJS doesn't change your source code. It generates a container that emulates a simple NodeJS environment.
* **Unobtrusive Code** OneJS puts all the content into an isolated JS object.

![](http://oi41.tinypic.com/aw2us3.jpg)

### Examples
* See the example project included in this repository
* MultiplayerChess.com ([Source Code](https://github.com/azer/multiplayerchess.com/tree/master/frontend) - [Output](http://multiplayerchess.com/mpc.js) )

# Install
```bash
$ npm install one
```

# First Steps

## Creating the Bundle Script

OneJS walks the modules and dependencies defined by package.json files. To create your bundle, just go a project directory and type `onejs build` command:

```
$ onejs build package.json bundle.js
```

## Experimenting the Bundle Script

The output OneJS generates can be used by NodeJS, too. It's the easiest way of making sure if the output works or not.

```
> var exampleProject = require('./bundle');
> exampleProject.main() // calls main module, returns its exports
> exampleProject.require('./b') // each package object has a require method available for external calls
```

In the case what you need is to try it in web browsers, onejs has a "server" option that'll publish the source code at `localhost:1338` let you debug the output with Firebug Lite easily;

```
$ ../bin/onejs server example-project/package.json
```

## Using the NodeJS Core Library

Many modules of the core NodeJS library is able to be used by web projects, as well. OneJS has an 'install' command that converts demanded remote NodeJS module to a package on the fly:

```javascript
> onejs install assert path url
```

The reference of available modules that you can install: https://github.com/azer/onejs/blob/master/lib/install_dict.js

## Process

OneJS includes a simple emulation of [NodeJS' process](http://nodejs.org/api/process.html). (Pass --noprocess if you don't need it)

```javascript
> exampleProject.require('dependency'), exampleProject.require('./b');
> exampleProject.lib.process.stdout.write("Hello World");
> exampleProject.stdout();
"Hello World"
```

## Debug Mode

Pass `--debug` parameter disabling cache and passing ENV variables to the built file. If we assume that we have a module that depends on ENV;

```javascript
if( process.env.VERBOSE ){
  console.log( "fabula de narratur" );
}
```
Above module becomes available to access ENV on debug-mode;

```bash
$ VERBOSE=1 onejs build package.json --debug
```

## Requiring Global Variables

OneJS doesn't change the way we access global variables. However, we may want to use require statements to access global variables (such as document, jQuery etc..) for purposes like dependency injection or documentation. Following example demonstrates the usage of `--tie` option that lets us require global variables;

```javascript
var $   = require('jquery'),
    dom = require('dom'),
    pi  = require('pi');

$(dom).ready(function(){
  console.log( pi == Math.PI ); // true
});
```

```bash
$ onejs build package.json --tie pi=Math.PI,jquery=jQuery,dom=document
```

## Excluding Specific Dependencies

There are some cases we prefer to not have some dependency packages in the build. The `--exclude` option leads OneJS ignore the specified packages;

```bash
$ onejs build package.json --exclude underscore,request
```

If the case is to remove a duplication from the build, it would be a good idea to combine `--tie` and `--exclude` together;

```bash
$ onejs build package.json --exclude underscore --tie underscore=window._
```

## Sandboxing Console Object

OneJS doesn't provide an embed, encapsulated console object by default. Pass `--sandbox-console` if needed, output is available by `projectName.stdout()` and `project.stderr()`.

```bash
$ onejs build package.json foobar.js --sandbox-console
```

```javascript
> var foobar = require('./foobar');
> foobar.stdout();
'Trying out the embed console'
'Hello world!'
> foobar.stderr()
'warning! something may be going wrong!'
'error! something went wrong!'
```

# Troubleshooting

* The most common issue of a OneJS output is to lack some dependencies. In that case, make sure that the library is located under `node_modules/` properly.
* Enabling verbose mode might be helpful: `onejs build package.json --verbose`
* See the content of `projectName.map` object if it contains the missing dependency
