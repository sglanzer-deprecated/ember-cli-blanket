/*global blanket */
(function() {
  //TODO: Refactor/cleanup
  blanket.customReporter = function(coverageData) {
    var fileCoverage = [];
    // Since blanket stores additional properties on arrays, pull them out and put them on objects
    // or else when we send to the reporter using JSON.stringify those properties won't be included.
    for (var x in coverageData.files) {
      var fileData = coverageData.files[x];
      var branchData = [];
      for (var branchIndex in fileData.branchData) {
        if (fileData.branchData.hasOwnProperty(branchIndex)) {
          var cols = fileData.branchData[branchIndex];
          var newCols = [];
          for (var colIndex in cols) {
            if (cols.hasOwnProperty(colIndex)) {
              var thisline = cols[colIndex];
              var updatedLine = {};
              for (var modeIndex in thisline) {
                if (thisline.hasOwnProperty(modeIndex)) {
                  updatedLine[modeIndex] = thisline[modeIndex];
                }
              }
              newCols[colIndex] = updatedLine;
            }
          }
          branchData[branchIndex] = newCols;
        }
      }
      fileCoverage.push({
        fileName: x,
        lines: fileData,
        source: fileData.source,
        branchData: branchData
      });
    }
    // Create our own data structure to insulate from blanket's internals
    window._$blanket_coverageData = {
      fileData: fileCoverage,
      stats: coverageData.stats
    };
    // Call the standard reporter well to get inline data (assuming you're running in browser)
    blanket.defaultReporter(coverageData);
  };

})();
