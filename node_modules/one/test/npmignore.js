var assert            = require('assert'),
    one               = require('../lib'),
    assertListContent = require('./common').assertListContent;

function test_content(callback){
  one.npmignore('./example-project', function(error, content){
    assert.ok(!error);
    assertListContent(content, ['lib.ignored1.js', 'lib/ignored2', 'lib/ignored3', 'test']);
    callback();
  });
}

module.exports = {
  'test_content': test_content
};

