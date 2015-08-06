var Reporter = require('../reporter');

/**
 * NullReporter outputs nothing
 * @class  NullReporter
 * @param {Object} options hash of options interpreted by reporter
 */
module.exports = Reporter.extend({
  report: function(/* coverageData */) {
  },
  processOptions: function(/* options */) {
  }
});
