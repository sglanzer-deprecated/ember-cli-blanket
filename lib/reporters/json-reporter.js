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


function sumProperty(aTotal, other, property) {
  return (aTotal[property] ? aTotal[property] : 0) + other[property];
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

function modulesCoverage(fileData, options) {
  var moduleRegex = new RegExp(options.modulePattern),
    output,
    collection = {};
    fileData.forEach(function(aFile) {
      var moduleName = aFile.name.match(moduleRegex)[1];
      var current = collection[moduleName] || { name: moduleName };

      current.statementsTotal = sumProperty(current, aFile, 'statementsTotal');
      current.statementsCovered = sumProperty(current, aFile, 'statementsCovered');

      if (options.branchTracking) {
        current.branchesTotal = sumProperty(current, aFile, 'branchesTotal');
        current.branchesCovered = sumProperty(current, aFile, 'branchesCovered');
      }
      collection[moduleName] = current;
    });

    output = _.values(collection);
    output.forEach(addPercentage);
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
  defaultOutput: 'coverage.json',
  wantsJSONOutput: true,
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
    if (this.options.modulePattern) {
      output.coverage.modules = modulesCoverage(output.coverage.files, this.options);
    }
    return output;
  }
});
