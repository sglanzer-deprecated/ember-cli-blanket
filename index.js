'use strict';

var path = require('path');
var replace = require('broccoli-replace');

module.exports = {
    name: 'Ember CLI Blanket',

    treeForVendor: function (tree) {
        var lib = this.treeGenerator(path.join(__dirname, 'lib'));
        var blanketOptions = this.pickFiles(lib, {
            files: ['blanket-options.js'],
            srcDir: '/',
            destDir: '/'
        });

        var blanketOptionsTree = replace(blanketOptions, {
            files: ['blanket-options.js'],
            patterns: [
                {
                    match: 'APP_NAME',
                    replacement: this.app.name
                }
            ]
        });

        return this.mergeTrees([tree, blanketOptionsTree].filter(Boolean));
    },

    included: function included(app) {
        this._super.included(app);

        if (app.tests) {
            var fileAssets = [
                path.join(app.bowerDirectory, 'blanket' ,'dist', 'qunit', 'blanket.js'),
                'vendor/blanket-options.js'
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

        var treeTestLoader = this.pickFiles(tree, {
            files: ['test-loader.js'],
            srcDir: 'assets',
            destDir: 'app'
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

        return this.mergeTrees([tree, blanketLoader, testLoaderTree], {
            overwrite: true
        });
    }
};
