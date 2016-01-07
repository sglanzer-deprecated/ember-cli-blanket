/*jshint expr: true */
var rewire = require('rewire');
var expect = require('chai').expect;
var middleware = rewire('../../lib/coverage-middleware');
var _ = require('lodash');

var instances = [];

function JsonReporter(options) {
  this.type = 'JsonReporter';
  this.options = options;
  instances.push(this);
}

JsonReporter.prototype.report = function(data) {
  this.reported = data;
};

function LcovReporter(options) {
  this.type = 'LcovReporter';
  this.options = options;
  instances.push(this);
}

LcovReporter.prototype.report = function(data) {
  this.reported = data;
};

function TeamCityReporter(options) {
  this.type = 'TeamCityReporter';
  this.options = options;
  instances.push(this);
}

TeamCityReporter.prototype.report = function(data) {
  this.reported = data;
};

describe('coverage middleware', function() {
  var middlewareFunc, req, res;
  var revertReporterForName, revertLoadBlanketOptions;

  beforeEach(function() {
    instances = [];

    var reporters = {
      'json': JsonReporter,
      'lcov': LcovReporter,
      'teamcity': TeamCityReporter,
    };

    revertReporterForName = middleware.__set__('reporterForName', function (name) {
      return reporters[name];
    });

    revertLoadBlanketOptions = middleware.__set__('loadBlanketOptions', function () {
      return {
        modulePrefix: 'foo-bar',
        filter: '//.*foo-bar/.*/',
        antifilter: '//.*(tests|template).*/',
        loaderExclusions: [],
        enableCoverage: true,
        cliOptions: {
          jsonOptions: {
            outputFile: 'coverage/coverage.json',
          },
          teamcityOptions: {
            outputFile: 'coverage/teamcity.txt',
          },
          lcovOptions: {
            outputFile: 'coverage/lcov.info',
          },
          reporters: ['teamcity', 'json', 'lcov'],
          autostart: true
        }
      };
    });

    middlewareFunc = middleware({});
    req = {
      body: 'my-data',
    };

    res = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.sent = data;
      }
    };

    middlewareFunc(req, res);
  });

  afterEach(function() {
    revertReporterForName();
    revertLoadBlanketOptions();
  });

  it('should instantiate all three reporters', function() {
    var types = _.pluck(instances, 'type');
    expect(types).to.be.eql(['TeamCityReporter', 'JsonReporter', 'LcovReporter']);
  });

  it('should have called report on all three reporters', function() {
    var reportedData = _.pluck(instances, 'reported');
    expect(reportedData).to.be.eql(['my-data', 'my-data', 'my-data']);
  });
});
