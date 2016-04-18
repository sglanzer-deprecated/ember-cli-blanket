/* globals module */

var EOL = require('os').EOL;

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('blanket', '5e94fc30f2e694bb5c3718ddcbf60d467f4b4d26', {saveDev: true})

        // Modify tests/index.html to include the blanket options after the application
        .then(function() {
            return this.insertIntoFile(
                'tests/index.html',
                '    <script src="assets/blanket-options.js"></script>',
                { after: '<script src="assets/' + this.project.config().modulePrefix + '.js"></script>' + EOL }
            );
        }.bind(this))

        // Modify tests/index.html to include the blanket loader after the blanket options
        .then(function() {
            return this.insertIntoFile(
                'tests/index.html',
                '    <script src="assets/blanket-loader.js"></script>',
                { after: '<script src="assets/blanket-options.js"></script>' + EOL }
            );
        }.bind(this))

        // modify the blanket reporter styles so it's not covered by the ember testing container
        .then(function() {
          return this.insertIntoFile(
              'tests/index.html',
              '    <style>#blanket-main { position: relative; z-index: 99999; }</style>',
              { after: '<link rel="stylesheet" href="assets/test-support.css">' + EOL }
          );
        }.bind(this));
  }
};
