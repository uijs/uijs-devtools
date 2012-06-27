# devtools for uijs

The toolchain for developing, building and devugging uijs modules and apps.

# Build

Builds the app in the current directory.

```bash
$ uijs-build
```


# Debugger

Builds a uijs app/module and starts the uijs debugger on http://localhost:5000

```bash
$ uijs-debugger --help
Debugger for uijs apps and modules
Usage: node ./debugger

Options:
  -a, --app    path to a uijs app (with package.json and all). defaults to cwd.
  -w, --watch  additional directories to watch for changes                                             
  --pre        optional prebuild script to execute before every build (cwd will be the app's directory)
```

# License

(The MIT License)

Copyright (c) 2012 uijs.org

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
