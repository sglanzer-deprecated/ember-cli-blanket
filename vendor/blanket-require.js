/* globals QUnit, blanket, loader */

// This could be a documented capability and move it out of blanket-loader
// it works, can't put it in test-helper b/c it loads too late
var seen = {};
var inBrowser = typeof window !== 'undefined' && this === window;
blanket.options('enableCoverage',inBrowser && window.location.search.indexOf('coverage') > -1);


var debug = function(msg) {
    var cliOptions = blanket.options('cliOptions') || {};
	if (cliOptions.debugCLI) {
		console.log('[ember-cli-blanket]:' + msg);
	}
}


var blanketLoader = function(moduleName, callback) {
    blanket.requiringFile(moduleName);
    var content = '(' + callback.toString() + ');//# sourceURL=' + moduleName + '.js';
    blanket.requiringFile(moduleName, true);
    try {
        var result = blanket.instrumentSync({
            inputFile: content,
            inputFileName: moduleName
        });

        return eval(result);
    } catch (err) {
        console.log(err);
    }
    return eval(content);
};

// Defer the start of the test run until a call to QUnit.start() this
// allows the modules to be loaded/instrumented prior to the test run
if (typeof(QUnit) === 'object') {
    QUnit.config.autostart = false;
}

var blanketWontCover = function(moduleName) {
    var anti = blanket.utils.matchPatternAttribute(moduleName, blanket.options('antifilter'));
    var match = !blanket.utils.matchPatternAttribute(moduleName, blanket.options('filter'));
    return anti || match;
};

var shouldExclude = function(moduleName) {
    if (moduleName.indexOf(blanket.options('modulePrefix')) === -1) {
      return blanketWontCover(moduleName);
    }

    if ( moduleName === blanket.options('modulePrefix') ) {
        return true;
    }

    // Loader exclusions are no longer necessary to fix conflicts with addon modules
    // but may still be used to remove data coverage for specific files (e.g. config/environment).
    var exclude = false;
    if (blanket.options('loaderExclusions')) {
        blanket.options('loaderExclusions').forEach(function (loaderExclusion) {
            if (moduleName.indexOf(loaderExclusion) > -1) {
                exclude = true;
            }
        });
    }
    if (exclude || blanketWontCover(moduleName)) {
        return true;
    }
    return exclude;
};



// proxy require to give us a chance to blanket required files
if (blanket.options('enableCoverage')) {
    loader.wrapModules = function(name, callback) {
            if (typeof(seen[name]) === 'undefined') {
                if (!shouldExclude(name)) {
                    seen[name] = true;
                    debug('requiring module: ' + name);

                    return blanketLoader(name, callback);
                }
            }
            return callback;
    };
    blanket.options('reporter', blanket.customReporter);
}

if (typeof exports !== 'undefined') {
    module.exports = {
        shouldExclude: shouldExclude
    };
}


/*
 * After running all the tests we'll loop over all matching requirejs
 * entries and annotate them so blanket will indicate their non-coverage
 */
moduleLoaderFinish = function() {
  if (blanket.options('enableCoverage')) {
    for (var moduleName in requirejs.entries) {
      if (typeof(seen[moduleName]) === 'undefined') {
        if (!shouldExclude(moduleName)) {
          try {
            debug('requiring unseen module: ' + moduleName);
            require(moduleName);
            seen[moduleName] = true;

          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }
};
