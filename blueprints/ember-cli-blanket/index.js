/* globals module */

var EOL = require('os').EOL;
var fs = require('fs');
var path = require('path');

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('blanket', '~1.1.5')

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

        .then(function() {
            var fullPath = path.join(this.project.root, 'tests/blanket-options.js');

            if (!fs.existsSync(fullPath)) {
                return this.insertIntoFile(
                    'tests/blanket-options.js',
                        '/* globals blanket */' + EOL + EOL +
                        'blanket.options({' + EOL +
                        '   modulePrefix: "' + this.project.config().modulePrefix + '",' + EOL +
                        '   filter: "//.*' + this.project.config().modulePrefix + '\/.*/",' + EOL +
                        '   antifilter: "//.*(tests).*/",' + EOL +
                        '   loaderExclusions: []' + EOL +
                        '});'
                )
            }
            else {
              return this.insertIntoFile(
                'tests/blanket-options.js',
                '   modulePrefix: "' + this.project.config().modulePrefix + '",',
                { after: 'blanket.options({' + EOL }
              );
            }
      }.bind(this));
  }
};
