'use strict';

var path = require('path');

module.exports = {
  name: 'Ember CLI Blanket',

  included: function included(app) {
    this._super.included(app);

    if (app.tests) {
      var fileAssets = [
        'node_modules/ember-cli-blanket/node_modules/blanket/dist/qunit/blanket.js'
      ];

      fileAssets.forEach(function(file){
        app.import(file, {
          type: 'test'
        });
      });

    }
  }
};