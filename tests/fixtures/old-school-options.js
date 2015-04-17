blanket.options = {
  modulePrefix: "todomvc-ember-cli",
  filter: "//.*todomvc-ember-cli/.*/",
  antifilter: "//.*(tests|template).*/",
  modulePattern: "\/(\\w+)",
  branchTracking: true,
  loaderExclusions: [],
  enableCoverage: true,
  cliOptions: {
    outputFile: 'test-output.json',
    reporters: ['json']
  }
};
