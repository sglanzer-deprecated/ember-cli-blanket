var Reporter = require('../reporter');

var lcovRecord = function(data) {

  var str = "",
      lineHandled = 0,
      lineFound = 0;

  str += 'SF:' + data.fileName + '\n';
  data.lines.forEach(function(value, num) {
    if (value !== null) {
      str += 'DA:' + num + ',' + value + '\n';
      lineFound += 1;
      if (value > 0) {
        lineHandled += 1;
      }
    }
  });

  str += 'LF:' + lineFound + '\n';
  str += 'LH:' + lineHandled + '\n';
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
