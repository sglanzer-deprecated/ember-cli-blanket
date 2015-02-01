/* jshint node: true */
'use strict';

var path = require('path');
var replace = require('broccoli-replace');

module.exports = {
    name: 'Ember CLI Blanket',

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
            var treeTestLoader = this.pickFiles(tree, {
                files: ['test-loader.js'],
                srcDir: 'assets',
                destDir: 'app'
            });

            var tests = this.treeGenerator(path.join(this.project.root,  'tests'));

            var blanketOptions = this.pickFiles(tests, {
                files: ['blanket-options.js'],
                srcDir: '/',
                destDir: '/assets'
            });

            var lib = this.treeGenerator(path.join(__dirname, 'lib'));

            var blanketLoader = this.pickFiles(lib, {
                files: ['blanket-loader.js'],
                srcDir: '/',
                destDir: '/assets'
            });

            var qunitStart = this.pickFiles(lib, {
                files: ['qunit-start.js'],
                srcDir: '/',
                destDir: '/'
            });

            var testLoaderTree = this.concatFiles(this.mergeTrees([treeTestLoader, qunitStart]), {
                inputFiles: ['**/*.js'],
                outputFile: '/assets/test-loader.js'
            });

            return this.mergeTrees([tree, blanketOptions, blanketLoader, testLoaderTree], {
                overwrite: true
            });
        }
        else {
            return tree;
        }
    }
};
