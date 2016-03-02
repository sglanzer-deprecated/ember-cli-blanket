/*jshint expr:true */
/*global blanket:true */
// mocking up the bits of blanket that we need to test `shouldExclude`
//
var options = {
  reporter: null,
  adapter: null,
  filter: null,
  customVariable: null,
  loader: null,
  ignoreScriptError: false,
  existingRequireJS: false,
  autoStart: false,
  timeout: 180,
  ignoreCors: false,
  branchTracking: false,
  sourceURL: false,
  debug: false,
  engineOnly: false,
  testReadyCallback: null,
  commonJS: false,
  instrumentCache: false,
  modulePattern: null,
  ecmaVersion: 5
};
var _blanket = global['blanket'] = {
  extend: function(obj) {
    //borrowed from underscore
    _blanket._extend(_blanket, obj);
  },

  _extend: function(dest, source) {
    if (source) {
      for (var prop in source) {
        if (dest[prop] instanceof Object && typeof dest[prop] !== 'function') {
          _blanket._extend(dest[prop], source[prop]);
        } else {
          dest[prop] = source[prop];
        }
      }
    }
  },

  options: function(key, value) {
    if (typeof key !== 'string') {
      _blanket._extend(options, key);
    } else if (typeof value === 'undefined') {
      return options[key];
    } else {
      options[key] = value;
    }
  },
  utils: {
    normalizeBackslashes: function(str) {
      return str.replace(/\\/g, '/');
    },
    matchPatternAttribute: function(filename, pattern) {
      if (typeof pattern === 'string') {
        if (pattern.indexOf("[") === 0) {
          //treat as array
          var pattenArr = pattern.slice(1, pattern.length - 1).split(",");
          return pattenArr.some(function(elem) {
            return _blanket.utils.matchPatternAttribute(filename, _blanket.utils.normalizeBackslashes(elem.slice(1, -1)));
          //return filename.indexOf(_blanket.utils.normalizeBackslashes(elem.slice(1,-1))) > -1;
          });
        } else if (pattern.indexOf("//") === 0) {
          var ex = pattern.slice(2, pattern.lastIndexOf('/'));
          var mods = pattern.slice(pattern.lastIndexOf('/') + 1);
          var regex = new RegExp(ex, mods);
          return regex.test(filename);
        } else if (pattern.indexOf("#") === 0) {
          return window[pattern.slice(1)].call(window, filename);
        } else {
          return filename.indexOf(_blanket.utils.normalizeBackslashes(pattern)) > -1;
        }
      } else if (pattern instanceof Array) {
        return pattern.some(function(elem) {
          return _blanket.utils.matchPatternAttribute(filename, elem);
        });
      } else if (pattern instanceof RegExp) {
        return pattern.test(filename);
      } else if (typeof pattern === "function") {
        return pattern.call(window, filename);
      }
    }
  }
//
};

global['_blanket'] = global['blanket'] = blanket;
console.log(blanket);

var shouldExclude = require('../../vendor/blanket-require').shouldExclude;
var expect = require('chai').expect;
describe('exclusions', function() {
  before(function() {
    blanket.options({
      modulePrefix: 'myModule',
      filter: '//^myModule/.*/',
      antifilter: '//.*(tests|templates).*/'
    });
  });
  it('should not exclude module files', function() {
    expect(shouldExclude('myModule/models/model.js')).to.be.false;
  });
  it('should not not pick up modulePrefix unless it is the module prefix', function() {
    expect(shouldExclude('notmyModule/models/model.js')).to.be.true;
  });
  it('should exclude test files', function() {
    expect(shouldExclude('myModule/tests/models/model-test.js')).to.be.true;
  });
  it('should exclude template files', function() {
    expect(shouldExclude('myModule/templates/mytemplate.js')).to.be.true;
  });
});
