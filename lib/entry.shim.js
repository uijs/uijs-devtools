window.require = require;

// lazy require so that app code will not execute before onload
Object.defineProperty(window, 'main', {
  get: function() {
    return require('{{__MAIN_MODULE__}}');
  }
});