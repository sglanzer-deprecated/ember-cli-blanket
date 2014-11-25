/* globals module */

var EOL = require('os').EOL;

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('blanket', '~1.1.5')

        // Modify tests/index.html to include the blanket loader after the application
        .then(function() {
            return this.insertIntoFile(
                'tests/index.html',
                '    <script src="assets/blanket-loader.js"></script>',
                { after: '<script src="assets/' + this.project.config().modulePrefix + '.js"></script>' + EOL }
            );
        }.bind(this));
  }
};
