var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var fixture = require('../../fixtures/todo-blanket');
var LCOVReporter = require('../../../lib/reporters/lcov-reporter');

describe('LCOV Reporter', function() {
  it('should work without branches or modules', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/lcov-output-no-renamer.dat'), 'utf8');
    var reporter = new LCOVReporter({});
    var output = reporter.transform(fixture);
    expect(output).to.deep.equal(expectedOutput);
  });
  it('should replace modules names with file names when requested', function () {
    var expectedOutput = fs.readFileSync(path.join(__dirname, '../../fixtures/lcov-output-with-renamer.dat'), 'utf8');
    var reporter = new LCOVReporter({
      lcovOptions: {
        renamer: function(moduleName){
          return moduleName.replace(/^todomvc-ember-cli/, 'something-else');
        }
      }
    });
    var output = reporter.transform(fixture);
    expect(output).to.deep.equal(expectedOutput);
  });
});
