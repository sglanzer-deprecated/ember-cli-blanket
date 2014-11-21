/* globals module */

var EOL = require('os').EOL;

module.exports = {
    normalizeEntityName: function() {},

    afterInstall: function() {
        // Import blanket using bower
        return this.addBowerPackageToProject('blanket', '~1.1.5')

            // Modify tests/index.html to include blanket options
            // and the call to start QUnit (since blanket turns autostart
            // off to allow the instrumented modules to load)
            .then(function() {
                return this.insertIntoFile(
                    'tests/index.html',

                    '   <script>' + EOL +
                    '       blanket.options({' + EOL +
                    '           filter: "' + this.project.config().modulePrefix + '",' + EOL +
                    '           antifilter: "-test.js"' + EOL +
                    '       });' + EOL +
                    '   </script>',

                    { after: '<script src="assets/test-support.js"></script>' + EOL }
                );
            }.bind(this))

            .then(function() {
                return this.insertIntoFile(
                    'tests/index.html',

                        '   <script>' + EOL +
                        '       QUnit.start();' + EOL +
                        '   </script>',

                    { after: '<script src="assets/test-loader.js"></script>' + EOL }
                );
            }.bind(this));
    }
};