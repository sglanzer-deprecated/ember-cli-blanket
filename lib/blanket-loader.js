/* globals requirejs, require */

var blanketLoader = function(moduleName) {
    _blanket.requiringFile(moduleName);

    var content = "define(\"" + moduleName + "\", \n  [\"ember\",\"exports\"],\n" +
        requirejs.entries[moduleName].callback.toString() +
        ");//# sourceURL=" + moduleName + ".js";

    _blanket.utils.processFile(
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
    var shouldLoad = false;

    if (!moduleName.match(/tests\//) && !moduleName.match(/templates\//)) {
        shouldLoad = true;
    }

    if (shouldLoad) {
        blanketLoader(moduleName);
    }
}