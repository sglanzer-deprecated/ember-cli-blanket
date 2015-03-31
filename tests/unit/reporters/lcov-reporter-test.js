var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var fixture = require('../../fixtures/todo-blanket');
var LCOVReporter = require('../../../lib/reporters/lcov-reporter');

describe('LCOV Reporter', function() {
  it('should work without branches or modules', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/lcov.dat'), 'utf8');
    var reporter = new LCOVReporter({});
    var output = reporter.transform(fixture);
    expect(output).to.deep.equal(expectedOutput);
  });
});

