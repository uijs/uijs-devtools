{{ treeName }}.module({{ parentId }}, function(/* parent */){

  return {
    'id': '{{ id }}',
    'pkg': arguments[0],
    'wrapper': function(module, exports, global, Buffer,{{#sandbox_console}} console, {{/sandbox_console}} process, require, undefined){
      {{>content}}
    }
  };

});
