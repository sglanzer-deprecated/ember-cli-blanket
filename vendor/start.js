/*global QUnit, blanket, mocha, moduleLoaderFinish, $ */

var debug = function (msg) {
	var cliOptions = blanket.options('cliOptions') || {};
	if (cliOptions.debugCLI) {
		console.log('[ember-cli-blanket]:' + msg);
	}
};

function sendCoverage(completion) {
	try {
		var rawData = window._$blanket_coverageData;

		var data = JSON.stringify(rawData);
		debug('data size: ' + data.length);
		$.ajax({
			type: 'POST',
			async: false,
			url:'/write-blanket-coverage',
			datatype: 'json',
			contentType:'application/json; charset=utf-8',
			data: data,
			error: function(jqXHR, textStatus, errorThrown ) {
				console.log('[ember-cli-blanket]:' + textStatus + ': ' + errorThrown + ' while writing blanket coverage');
			},
			complete: completion
		  });
	} catch(err) {
		console.error('JSON stringify error:', err);
		throw err;
	}
}

var origBlanketOnTestsDone = blanket.onTestsDone;

function cliFinish() {
	moduleLoaderFinish();
	origBlanketOnTestsDone.apply(blanket);
	sendCoverage(function() {
		debug('done writing coverage');
	});
}

blanket.onTestsDone = cliFinish;

if (typeof(QUnit) === 'object') {
  QUnit.config.autostart = blanket.options('cliOptions').autostart !== false;
}
else if (typeof(mocha) === 'object') {

    /*
    * Mocha-BlanketJS adapter
    * Adds a BlanketJS coverage report at the bottom of the HTML Mocha report
    * Only needed for in-browser report; not required for the grunt/phantomjs task
    *
    * Distributed as part of the grunt-blanket-mocha plugin
    * https://github.com/ModelN/grunt-blanket-mocha
    * (C)2013 Model N, Inc.
    * Distributed under the MIT license
    *
    * Code originally taken from the BlanketJS project:
    * https://github.com/alex-seville/blanket/blob/master/src/adapters/mocha-blanket.js
    * Distributed under the MIT license
    */
    (function() {

        if(!mocha) {
            throw new Error("mocha library does not exist in global namespace!");
        }


        /*
         * Mocha Events:
         *
         *   - `start`  execution started
         *   - `end`  execution complete
         *   - `suite`  (suite) test suite execution started
         *   - `suite end`  (suite) all tests (and sub-suites) have finished
         *   - `test`  (test) test execution started
         *   - `test end`  (test) test completed
         *   - `hook`  (hook) hook execution started
         *   - `hook end`  (hook) hook complete
         *   - `pass`  (test) test passed
         *   - `fail`  (test, err) test failed
         *
         */

        var originalReporter = mocha._reporter;

        var blanketReporter = function(runner) {
                runner.on('start', function() {
                  blanket.setupCoverage();
                });

                runner.on('end', function() {
                  blanket.onTestsDone();
                });
                runner.on('suite', function() {
                    blanket.onModuleStart();
                });

                runner.on('test', function() {
                    blanket.onTestStart();
                });

                runner.on('test end', function(test) {
                    blanket.onTestDone(test.parent.tests.length, test.state === 'passed');
                });

                //I dont know why these became global leaks
                runner.globals(['stats', 'failures', 'runner', '_$blanket']);

                originalReporter.apply(this, [runner]);
            };

        blanketReporter.prototype = originalReporter.prototype;

        mocha.reporter(blanketReporter);
    })();
}
