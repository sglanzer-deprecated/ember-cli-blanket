var TeamCityReporter = require('../../../lib/reporters/teamcity-reporter');
var fixture = require('../../fixtures/todo-blanket');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

describe('Teamcity Reporter', function() {
  it('should work without branches or modules', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/teamcity-output-no-branches.txt'), 'utf8');
    var reporter = new TeamCityReporter({});
    var output = reporter.transform(fixture);
    expect(output).to.deep.equal(expectedOutput);
  });
});
