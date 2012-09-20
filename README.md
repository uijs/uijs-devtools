# devtools for uijs

[![Build Status](https://secure.travis-ci.org/uijs/uijs-devtools.png)](http://travis-ci.org/uijs/uijs-devtools)

This is the `uijs` devtool. It is used to bundle, debug, benchmark and generally have fun with [uijs](https://github.com/uijs/uijs).

To get started with __uijs__, see the 
uijs [README](https://github.com/uijs/uijs/blob/master/README.md).

See [organization](https://github.com/uijs/uijs/blob/master/doc/organization.md) for some info on what's here and what's elsewhere.

## Usage

```bash
$ uijs
Development tools for uijs apps and modules
Usage: uijs <command> <app> [options]

<command> is one of:
  build - Builds a uijs module or app
  debug - Starts a debugging server for a uijs module/app (also builds)
  bench - Runs a benchmark against mock canvas for --duration (also builds)
  prof - Runs a benchmark and assumes --prof (sugar!)

<app> is is one of:
  (not specified) - Looks for package.json in current directory
  path/to/app/directory - A path to a directory that contains a package.json file
  path/to/package.json - Explicit path to an app/module package.json
  path/to/module.js - Explicit path to a single module (for apps that only depend on uijs)

Options:
  --watch, -w    watch for changes (defaults to cwd). multiple -w options may be used
  --verbose, -v  verbose output                                                      
  --output, -o   path to output directory (default is ./dist)                        
  --html, -h     path to html output (default is dist/<entrypoint>.uijs.html)        
  --duration     duration of benchmark in seconds (default 5 seconds)                  [default: 5]
  --prof         output profiling information to stdout after benchmark              
  --help         prints usage and options                                            
```

## License

(The MIT License)

Copyright (c) 2012 uijs.org and other uijs contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.