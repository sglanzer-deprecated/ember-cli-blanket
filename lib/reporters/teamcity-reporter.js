var Reporter = require('../reporter');
var _ = require('lodash');

var percentage = function(number, total) {
  return (Math.round(((number / total) * 100) * 100) / 100);
};


function totalProperty(fileData, propName) {
  return _(fileData).pluck(propName).reduce(function(memo, value) {
    return memo + value;
  }, 0);
}

function addPercentage(output) {
  output.percentage = percentage(output.statementsCovered, output.statementsTotal);
}

/*
 * arrgh - nested array of branch coverage data
 * cribbed from blanket
 */
var branchCoverage = function(fileData) {
  var branches = fileData.branchData;
  var totalBranches, passedBranches;
  totalBranches = passedBranches = 0;

  if (_.isArray(branches)) {
    for (var j = 0; j < branches.length; j++) {
      if (_.isArray(branches[j])) {
        for (var k = 0; k < branches[j].length; k++) {
          if (_.isArray(branches[j][k])) {
            totalBranches++;
            if (_.isArray(branches[j][k][0]) &&
              branches[j][k][0].length > 0 &&
              _.isArray(branches[j][k][1]) &&
              branches[j][k][1].length > 0) {
              passedBranches++;
            }
          }
        }
      }
    }
    return {
      branchesTotal: totalBranches,
      branchesCovered: passedBranches
    };
  }
};

/*
 * Output coverage for a specific file
 */
var fileCoverage = function(data) {
  var output = {
    name: data.fileName
  };

  var statements = _.without(data.lines, null);

  output.statementsTotal = statements.length;
  output.statementsCovered = _.compact(statements).length;
  output.percentage = percentage(output.statementsCovered, output.statementsTotal);

  if (this.options.branchTracking) {
    output = _.assign(output, branchCoverage(data));
  }
  return output;

};


function totals(coverageData, fileCoverage, options) {
  var output = {
    statementsTotal: totalProperty(fileCoverage, 'statementsTotal'),
    statementsCovered: totalProperty(fileCoverage, 'statementsCovered')
  };
  addPercentage(output);
  if (options.branchTracking) {
    output.branchesTotal = totalProperty(fileCoverage, 'branchesTotal');
    output.branchesCovered = totalProperty(fileCoverage, 'branchesCovered');
  }
  return output;
}


/**
 * JSONReporter outputs json formatted coverage data
 * from the test run
 *
 * @class  JSONReporter
 * @param {Object} options hash of options interpreted by reporter
 */
module.exports = Reporter.extend({
  name: 'json',
  defaultOutput: 'teamcity.txt',
  wantsJSONOutput: false,
  transform: function(coverageData) {
    var output = {
      stats: coverageData.stats,
      coverage: {
        total: {},
        files: []
      }
    };
    output.coverage.files = _.map(coverageData.fileData, fileCoverage, this);
    output.coverage.total = totals(coverageData, output.coverage.files, this.options);

    var teamcityOutput = "";
    teamcityOutput += "##teamcity[message text='Code Coverage is " + output.coverage.total.percentage + "%']\n";
    teamcityOutput += "##teamcity[blockOpened name='Code Coverage Summary']\n";
    teamcityOutput += "##teamcity[buildStatisticValue key='CodeCoverageB' value='" + output.coverage.total.percentage + "']\n";
    teamcityOutput += "##teamcity[buildStatisticValue key='CodeCoverageAbsLCovered' value='" + output.coverage.total.statementsCovered + "']\n";
    teamcityOutput += "##teamcity[buildStatisticValue key='CodeCoverageAbsLTotal' value='" + output.coverage.total.statementsTotal + "']\n";
    teamcityOutput += "##teamcity[buildStatisticValue key='CodeCoverageL' value='" + output.coverage.total.percentage + "']\n";
    teamcityOutput += "##teamcity[blockClosed name='Code Coverage Summary']\n";
    console.log(teamcityOutput);

    return teamcityOutput;
  }
});
