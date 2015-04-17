/* globals blanket */
var options = {
    modulePrefix: "todomvc-ember-cli",
    filter: "//.*todomvc-ember-cli/.*/",
    antifilter: "//.*(tests|template).*/",
    modulePattern: "\/(\\w+)",
    branchTracking: true,
    loaderExclusions: [],
    enableCoverage: true,
    cliOptions: {
      jsonOptions: {
        outputFile: 'test-output.json'
      },
      xcovOptions: {
        outputFile: 'xcov.dat'
      },
      reporters: ['json']
    }
  };

if (typeof exports === undefined) {
  blanket.options(options);
} else {
  module.exports = options;
}
