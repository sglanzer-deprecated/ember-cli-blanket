/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var coverageMiddleware = require('./lib/coverage-middleware');
var bodyParser = require('body-parser');
var VersionChecker = require('ember-cli-version-checker');
var debug = require('debug')('ember-cli-blanket');
var VersionChecker = require('ember-cli-version-checker');

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

module.exports = {
  name: 'Ember CLI Blanket',
  checkDeps: function() {
      var checker = new VersionChecker(this),
          bowerDep = checker.for('loader.js', 'bower'),
          npmDep = checker.for('loader.js', 'npm');
          debug('loader.js version (bower): ', bowerDep.version);
          debug('loader.js version (npm): ', npmDep.version);
      return (bowerDep.satisfies('>= 3.6.1') || npmDep.satisfies('>= 4.0.0'));
  },

  init: function() {
    this._super.init && this._super.init.apply(this, arguments); // jshint ignore:line

    if (!this.checkDeps()) {
        throw new Error('loader.js must be >= 3.6.1 (bower) or >= 4.0.0 (npm)');
    }
  },

  validEnv: function() {
    return this.app.env !== 'production';
  },

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function included(app) {
    this._super.included(app);

    if (app.tests) {
      var fileAssets = [
        path.join(app.bowerDirectory, 'blanket', 'dist', 'qunit', 'blanket.js'),
      ];

      fileAssets.forEach(function(file) {
        app.import(file, {
          type: 'test'
        });
      });
    }
  },

  middleware: function(app, options) {
    app.post('/write-blanket-coverage',
             bodyParser.json({ limit: '50mb' }),
             coverageMiddleware(options),
             logErrors);
  },
  testemMiddleware: function(app) {
    this.middleware(app, { root: this.project.root });
  },
  serverMiddleware: function(options) {
    this.app = options.app;
    if(!this.validEnv()) { return; }
    this.middleware(options.app, { root: this.project.root });
  },
  postprocessTree: function(type, tree) {
    if (this._requireBuildPackages) {
      this._requireBuildPackages();
    }
    var checker = new VersionChecker(this);
    var isNpmTestLoader = checker.for('ember-cli', 'npm').satisfies('>= 2.7.0');
    var testLoaderFile = isNpmTestLoader ? 'tests.js' : 'test-loader.js';
    if (type === 'all' && this.app.tests) {
      var treeTestLoader = new Funnel(tree, {
        files: isNpmTestLoader ? [testLoaderFile, 'tests.map'] : [testLoaderFile], // don't loose the sourcemaps
        srcDir: 'assets',
        destDir: 'app'
      });

      var tests = this.treeGenerator(path.join(this.project.root, 'tests'));

      var blanketOptions = new Funnel(tests, {
        files: ['blanket-options.js'],
        srcDir: '/',
        destDir: '/assets'
      });

      var vendor = this.treeGenerator(path.join(__dirname, 'vendor'));

      var blanketLoader = new Funnel(vendor, {
        files: ['blanket-reporter.js', 'blanket-require.js'],
        srcDir: '/',
        destDir: '/'
      });

      blanketLoader = this.concatFiles(blanketLoader, {
        inputFiles: ['blanket-reporter.js', 'blanket-require.js'], // Order here is important
        outputFile: '/assets/blanket-loader.js'
      });

      var start = new Funnel(vendor, {
        files: ['start.js'],
        srcDir: '/',
        destDir: '/'
      });

      var testLoaderTree = this.concatFiles(mergeTrees([treeTestLoader, start]), {
        inputFiles: ['**/*.js'],
        outputFile: '/assets/' + testLoaderFile
      });

      return mergeTrees([tree, blanketOptions, blanketLoader, testLoaderTree], {
        overwrite: true
      });
    } else {
      return tree;
    }
  }
};
