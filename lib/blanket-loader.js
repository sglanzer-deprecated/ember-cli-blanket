/* globals blanket, requirejs, require */

var blanketLoader = function(moduleName) {
    blanket.requiringFile(moduleName);

    var module = requirejs.entries[moduleName];

    var dependencies = "[";
    if (module.deps.length > 0) {
        module.deps.forEach(function (dep) {
            dependencies = dependencies + "\"" + dep + "\", ";
        });

        dependencies = dependencies.substr(0, dependencies.length - 2);
    }
    dependencies = dependencies + "]";

    var content =
        "define(\"" + moduleName + "\", \n  " +
        dependencies + ", \n" +
        module.callback.toString() +
        ");//# sourceURL=" + moduleName + ".js";

    blanket.utils.processFile(
        content,
        moduleName,
        function newLoader() {
            require(moduleName);
        },
        function oldLoader() {
            require(moduleName);
        }
    );
};

// Defer the start of the test run until a call to QUnit.start() this
// allows the modules to be loaded/instrumented prior to the test run
if (typeof(QUnit) === 'object') {
    QUnit.config.autostart = false;
}

var moduleLoader = function() {
	for (moduleName in requirejs.entries) {
		if (moduleName.indexOf(blanket.options('modulePrefix')) === -1) {
		  continue;
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

		if (!exclude) {
			blanketLoader(moduleName);
		}
	}
}

// This could be a documented capability and move it out of blanket-loader
// it works, can't put it in test-helper b/c it loads too late
blanket.options('enableCoverage',window.location.search.indexOf('coverage=1') > -1);

// without the above just adding/changing option value in blanket-options.js works
// this is, of course, hijacking the blanket options namespace - so future conflicts could arise
// hack: true
if (blanket.options('enableCoverage')) {
    moduleLoader();
}
