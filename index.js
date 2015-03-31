/* jshint node: true */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
module.exports = {
    name: 'Ember CLI Blanket',

    blueprintsPath: function() {
      return path.join(__dirname, 'blueprints');
    },

    included: function included(app) {
        this._super.included(app);

        if (app.tests) {
            var fileAssets = [
                path.join(app.bowerDirectory, 'blanket' ,'dist', 'qunit', 'blanket.js')
            ];

            fileAssets.forEach(function(file){
                app.import(file, {
                    type: 'test'
                });
            });

        }
    },

    postprocessTree: function(type, tree) {
        this._requireBuildPackages();

        if (type === 'all' && this.app.tests) {
            var treeTestLoader = new Funnel(tree, {
                files: ['test-loader.js'],
                srcDir: 'assets',
                destDir: 'app'
            });

            var tests = this.treeGenerator(path.join(this.project.root,  'tests'));

            var blanketOptions = new Funnel(tests, {
                files: ['blanket-options.js'],
                srcDir: '/',
                destDir: '/assets'
            });

            var lib = this.treeGenerator(path.join(__dirname, 'lib'));

            var blanketLoader = new Funnel(lib, {
                files: ['blanket-loader.js'],
                srcDir: '/',
                destDir: '/assets'
            });

            var start = new Funnel(lib, {
                files: ['start.js'],
                srcDir: '/',
                destDir: '/'
            });

            var testLoaderTree = this.concatFiles(mergeTrees([treeTestLoader, start]), {
                inputFiles: ['**/*.js'],
                outputFile: '/assets/test-loader.js'
            });

            return mergeTrees([tree, blanketOptions, blanketLoader, testLoaderTree], {
                overwrite: true
            });
        }
        else {
            return tree;
        }
    }
};
