var JSONReporter = require('../../../lib/reporters/json-reporter');
var fixture = require('../../fixtures/todo-blanket');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

describe('JSON Reporter', function() {
  it('should work without branches or modules', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/json-output-no-branches.json'), 'utf8');
    var reporter = new JSONReporter({});
    var output = reporter.transform(fixture);
    expect(output).to.deep.equal(JSON.parse(expectedOutput));
  });

  it('should include branches when branchCoverage=true', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/json-output-with-branches.json'), 'utf8');
    var reporter = new JSONReporter({ branchTracking: true });
    var output = reporter.transform(fixture);
    fs.writeFileSync('testoutput.json', JSON.stringify(output));
    expect(output).to.deep.equal(JSON.parse(expectedOutput));
  });
  it('should include branches and modules when branchCoverage=true and modules=true', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/json-output-branches-and-modules.json'), 'utf8');
    var reporter = new JSONReporter({ branchTracking: true, modulePattern: "\/(\\w+)",
 });
    var output = reporter.transform(fixture);
    fs.writeFileSync('testoutput.json', JSON.stringify(output));
    expect(output).to.deep.equal(JSON.parse(expectedOutput));
  });
});
