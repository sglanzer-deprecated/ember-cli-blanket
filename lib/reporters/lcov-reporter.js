var Reporter = require('../reporter');

var lcovRecord = function(data) {

  var str = "";
  str += 'SF:' + data.fileName + '\n';
  data.lines.forEach(function(value, num) {
    if (value !== null) {
      str += 'DA:' + num + ',' + value + '\n';
    }
  });

  str += 'end_of_record';
  return str;
};
/**
 * LCOVReporter outputs lcov formatted coverage data
 * from the test run
 *
 * @class  LCOVReporter
 * @param {Object} options hash of options interpreted by reporter
 */
module.exports = Reporter.extend({
  name: 'lcov',
  defaultOutput: 'lcov.dat',
  transform: function(coverageData) {
    var data = coverageData.fileData.map(lcovRecord);
    return data.join('\n');
  }
});
