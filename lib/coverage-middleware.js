var optionUtils = require('./blanket-options');
var path = require('path');
var _ = require('lodash');

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

function loadReporter(blanketOptions, name) {
  var OutputReporter = reporterForName(name);
  var reporter = new OutputReporter(blanketOptions);
  return reporter;
}

module.exports = function(options) {

  var blanketOptions = loadBlanketOptions(options);
  var reporters = _.map(blanketOptions.cliOptions.reporters, function (reporter) {
    return loadReporter(blanketOptions, reporter);
  });

  return function(req, res) {
    _.forEach(reporters, function (reporter) {
      reporter.report(req.body);
    });

    res.status(200).send('all good');
  };
};
