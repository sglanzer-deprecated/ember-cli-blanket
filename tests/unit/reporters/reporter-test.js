/*jshint expr: true */
var Reporter = require('../../../lib/reporter');
var expect = require('chai').expect;
var assertFile = require('../../helpers/assert-file');
var path = require('path');
var root = process.cwd();
var tmp = require('tmp-sync');
var tmproot = path.join(root, 'tmp');
var fs = require('fs-extra');

describe('Reporter', function() {
  describe('Options Handling', function() {
    var options;
    beforeEach(function() {
      options = require(path.join(__dirname, '..', '..', 'fixtures', 'sample-options.js'), 'utf8');
    });
    it('should have default options if none present', function() {
      var TestReporter = Reporter.extend({
        name: 'test',
        defaultOutput: 'test.txt',
        transform: function(data) {
          expect(this.options).to.be.ok;
        }
      });
      var reporter = new TestReporter(options);
      reporter.transform({});
    });
    it('should have a default output file if no options set', function() {
      var TestReporter = Reporter.extend({
        defaultOutput: 'test.txt'
      });
      var reporter = new TestReporter(options);
      expect(reporter.outputFile).to.equal('test.txt');
    });
    it('should have options if set', function() {
      var TestReporter = Reporter.extend({
        name: 'xcov'
      });
      var reporter = new TestReporter(options);
      expect(reporter.outputFile).to.equal('xcov.dat');
    });
    it('should have a name', function() {
      var TestReporter = Reporter.extend({
        name: 'test',
        defaultOutput: 'test'
      });
      var reporter = new TestReporter(options);
      expect(reporter.name).to.equal('test');
    });
  });

  describe('output', function() {
    var tmpdir;
    var TestReporter = Reporter.extend({
      name: 'test',
      transform: function(data) {
        return data;
      }
    });
    beforeEach(function() {
      tmpdir = tmp.in(tmproot);
      process.chdir(tmpdir);
    });

    it('should write file to output file', function() {
      var reporter = new TestReporter({
        cliOptions: {
          testOptions: {
            outputFile: 'test.output'
          }
        }
      });
      reporter.report('bletch');
      assertFile('test.output', {
        contains: [
          "bletch"
        ]
      });
    });
    it('should JSONify output when so requested', function() {
      var reporter = new TestReporter({
        cliOptions: {
          testOptions: {
            outputFile: 'test.json'
          }
        }
      });
      reporter.wantsJSONOutput = true;
      reporter.report({
        data: 'foobaz'
      });
      assertFile('test.json', {
        contains: [
          "\"data\": \"foobaz\""
        ]
      });
    });
    it('should handle more than one reporter');
    it('should throw an error when no outputfile specified', function() {
      expect(function() {
      var reporter = new TestReporter({
        cliOptions: {}
      });
        reporter.report('bletch');
      }).to.throw('`cliOptions[test].outputFile` not specified - check blanket-options');
    });
  });
});
