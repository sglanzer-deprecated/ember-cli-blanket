var HTMLReporter = require('../../../lib/reporters/html-reporter');
var fixture = require('../../fixtures/todo-blanket');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');

describe('HTML Reporter', function() {
  it('should work without branches or modules', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/html-output-no-branches.html'), 'utf8');
    var reporter = new HTMLReporter({});
    var output = reporter.transform(fixture);
    //fs.writeFileSync(path.join(__dirname, '../../fixtures/html-output-no-branches.html'), output);
    expect(output).to.deep.equal(expectedOutput);
  });

  it('should include branches when branchCoverage=true', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/html-output-with-branches.html'), 'utf8');
    var reporter = new HTMLReporter({ branchTracking: true });
    var output = reporter.transform(fixture);
    //fs.writeFileSync(path.join(__dirname, '../../fixtures/html-output-with-branches.html'), output);
    expect(output).to.deep.equal(expectedOutput);
  });
  it('should include branches and modules when branchCoverage=true and modules=true', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/html-output-branches-and-modules.html'), 'utf8');
    var reporter = new HTMLReporter({ branchTracking: true, modulePattern: "\/(\\w+)" });
    var output = reporter.transform(fixture);
    //fs.writeFileSync(path.join(__dirname, '../../fixtures/html-output-branches-and-modules.html'), output);
    expect(output).to.deep.equal(expectedOutput);
  });
});
