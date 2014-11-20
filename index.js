'use strict';

var path = require('path');

module.exports = {
  name: 'Ember CLI Blanket',

  blueprintsPath: function() {
    return path.join(__dirname, 'blueprints');
  },

  included: function included(app) {
    this._super.included(app);

    if (app.tests) {
      var fileAssets = [
        'bower_components/blanket/dist/qunit/blanket.js'
      ];

      fileAssets.forEach(function(file){
        app.import(file, {
          type: 'test'
        });
      });

    }
  }
};