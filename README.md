# devtools for uijs

The toolchain for developing, building and devugging uijs modules and apps.

## Hello, world

This is how to get started with uijs. We will create a simple "Hello, world" app.

### `package.json`

Create a directory for your module and create a `package.json` file as follows:

```json
{
  "name": "<name-of-your-module>",
  "version": "<version>",
  "author": "yourname <user@domain.com>",
  "engines": {},
  "dependencies": {
    "uijs": "git+https://github.com/eladb/uijs"

  },
  "devDependencies": {
    "uijs-devtools": "git+https://github.com/eladb/uijs-devtools"
  },
  "optionalDependencies": {},
  "main": "./lib/index"
}
```

### `lib/index.js`

This is the module's root script. The script will export a uijs view as `module.exports`, which
later will be consumed by other apps/modules or the uijs debugger:

```javascript
var uijs = require('uijs');

// define my view
var myview = uijs.view();

myview.ondraw = function(ctx) {
  ctx.fillRect(0, 0, this.width(), this.height());
};

module.exports = myview;
```

### Run your app view the debugger

```bash
$ node_modules/.bin/uijs debug
<output>
```

Browse to http://localhost:5000 and you should see this:

[!]


## Usage

```bash
$ uijs
Development tools for uijs apps and modules
Usage: uijs <command> <app> [options]

<command> is one of:
  build - Builds a uijs module or app
  debug - Starts a debugging server for a uijs module/app (also builds)

<app> is is one of:
  (not specified) - Looks for package.json in current directory
  path/to/app/directory - A path to a directory that contains a package.json file
  path/to/package.json - Explicit path to an app/module package.json
  path/to/module.js - Explicit path to a single module (for apps that only depend on uijs)

Options:
  -w, --watch    watch for changes (defaults to cwd). multiple -w options may be used
  --verbose, -v  verbose output                           

```

# License

(The MIT License)

Copyright (c) 2012 uijs.org

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
