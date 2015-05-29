var optionUtils = require('./blanket-options');
var path = require('path');

function loadBlanketOptions(options) {
  var blanketOptions = null;
  var optionsPath = path.join(options.root, 'tests', 'blanket-options');
  try {
    blanketOptions = require(optionsPath);
  } catch (error) {
    if (!optionUtils.isCurrentFormat(optionsPath + '.js')) {
      throw new Error('blanket-options file is in old format - upgrade using `ember g ember-cli-blanket');
    }
  }
  return blanketOptions;
}

function reporterForName(reporterName) {
  return require(path.join(__dirname, 'reporters', reporterName + '-reporter'));
}

// TODO handle multiple reporters
function loadReporter(blanketOptions) {
  var reporterName = blanketOptions.cliOptions.reporters[0] || 'null';

  var OutputReporter = reporterForName(reporterName);
  var reporter = new OutputReporter(blanketOptions);
  return reporter;
}

module.exports = function(options) {


  var blanketOptions = loadBlanketOptions(options);
  var reporter = loadReporter(blanketOptions);

  return function(req, res) {
    reporter.report(req.body);
    res.status(200).send('all good');
  };
};
