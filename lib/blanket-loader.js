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

for (moduleName in requirejs.entries) {
    if (moduleName.indexOf(blanket.options('modulePrefix')) === -1) {
      continue;
    }

    var exclude = false;
    blanket.options('loaderExclusions').forEach(function(loaderExclusion) {
        if (moduleName.indexOf(loaderExclusion) > -1) {
            exclude = true;
        }
    });

    if (!exclude) {
        blanketLoader(moduleName);
    }
}
