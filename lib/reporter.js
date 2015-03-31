'use strict';

var CoreObject = require('core-object');
var fs = require('fs');

/**
 * Reporter transforms coverage data returned
 * from the test run to an output format
 *
 * @class  Reporter
 * @param {Object} options hash of options interpreted by reporter
 */
function Reporter() {
  CoreObject.apply(this, arguments);
}

Reporter.__proto__ = CoreObject;

Reporter.prototype.init = function(options) {
  this.options = options || {};
  this.processOptions(options);
};

Reporter.prototype.name = undefined;

Reporter.prototype.processOptions = function(options) {
  if (this.name === 'undefined') {
    throw new Error('Reporter must define `name`');
  }
  var cliOptions = options.cliOptions || {},
      myOptions = cliOptions[this.name+'Options'] || {};

  this.outputFile = myOptions.outputFile || this.defaultOutput;
  if (this.outputFile === undefined) {
    throw new Error('`cliOptions[' + this.name + '].outputFile` not specified - check blanket-options');
  }
};

Reporter.prototype.transform = function(/* coverageData */){
  throw new Error('Reporter needs to have a transform method defined.');
};

/**
 * `wantsJSONOutput` stringifies output when true
 * @type {Boolean}
 * @default false
 */
Reporter.prototype.wantsJSONOutput = false;

Reporter.prototype.report = function(coverageData) {
  var output = this.transform(coverageData);
  if (this.wantsJSONOutput) {
    output = JSON.stringify(output, null, 2);
  }
  fs.writeFileSync(this.outputFile, output);
};


module.exports = Reporter;
