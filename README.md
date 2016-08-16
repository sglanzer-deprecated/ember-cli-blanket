[![npm](https://img.shields.io/npm/v/ember-cli-blanket.svg)](https://www.npmjs.com/package/ember-cli-blanket)

Ember-cli-blanket
=========

[Blanket](http://blanketjs.org/) based code coverage for ember-cli applications

## Installation

Install the addon:
```sh
ember install ember-cli-blanket
# if ember-cli <= 0.2.2
ember install:addon ember-cli-blanket
```

## Requirements
* If using Mocha, Testem `>= 1.6.0` for which you need ember-cli `> 2.4.3`
* If using Mirage you need `ember-cli-mirage >= 0.1.13`
* If using Pretender (even as a dependency of Mirage) you need `pretender >= 0.11.0`

## Reporters

ember-cli-blanket can output coverage data to a file.

Four reporters are currently supported:

- json - provides summary and file level statistics
- lcov - provides a basic lcov formatted file
- teamcity - provides a total summary statistics for teamcity
- html - provides per-file statement and branch statistics in a format similar to blanket's default qunit reporter

Reporters have default output destinations and this can be overwritten in the `blanket-options.js` file, which is auto-installed in your `tests` folder.

```js
var options = {
...
    branchTracking: true,
    cliOptions: {
      jsonOptions: {
        // output file name relative to project's root dir, default is 'coverage.json'
        outputFile: 'test-output.json'
      },
      lcovOptions: {
        outputFile: 'lcov.dat',

        // automatically skip missing files, relative to project's root dir
        excludeMissingFiles: true, // default false

        // provide a function to rename es6 modules to a file path
        renamer: function(moduleName){
          // return a falsy value to skip given module
          if (moduleName === 'unwanted') { return; }

          var expression = /^APP_NAME/;
          return moduleName.replace(expression, 'app') + '.js';
        }
      },
      reporters: ['json']
    }
  };
```

Enable branch tracking in the html and json reporters by setting `branchTracking` to `true` in the main options within `blanket-options.js` (see above example).

Append ```?coverage=true``` to the HTML report URL to enable coverage. This option will enable the creation of the coverage data file when running within a continuous integration context.

You can add this as part of the ```ember test``` command for a single run:

```bash
ember test --test-page='tests/index.html?coverage=true'
```

or it can be specified within testem.json for use everytime you test:

```js
{
...
  'test_page': 'tests/index.html?coverage=true',
...
}
```

### Limitations of reporters

It should be noted that given the multitude of transformations that the javascript under test goes through that the output of the `lcov` reporter in particular will not match line for line the original input source.

In fact, there is current no direct mapping between the `es6` module names in the lcov output and the original input files.

### Reporters and Testing Mocks

When tests are complete an HTTP POST request is sent to the ember-cli express server to initiate the report writing process.  This request may get intercepted if you are using a mocking library like ember-cli-mirage or Pretender.  You will need to configure these libraries to "passthrough" the request.  

If you are using Pretender directly add
```js
this.post(
  '/write-blanket-coverage',
  this.passthrough
);
```

For versions of ember-cli-mirage before 0.2.0-beta.2 add this to your config.js

```js
this.pretender.post.call(
  this.pretender,
  '/write-blanket-coverage',
  this.pretender.passthrough
);
```

## Usage

Run `ember server`, navigate to the application url [/tests](http://localhost:4200/tests) (e.g. localhost:4200/tests) and select the "Enable coverage" checkbox.

A options file is available in tests/blanket-options.js that contains the current regex for data coverage (filter) the regex for exclusion from data coverage (antifilter) and an array of string to exclude from blanket's requirejs loader (loaderExclusions).

As of release 0.2.4 loader exclusions are no longer necessary to fix conflicts with addon modules.  Loader exclusions may still be used to remove data coverage for specific files (e.g. config/environment).

## Debugging Common Issues

If you do not see any coverage reports at the bottom of the page, even after clicking the enable coverage checkbox, check your console for errors. If you see something like `TypeError: blanket.instrumentSync is not a function` you need to update your version of blanket. Currently, we are pointing to a fork of blanket, but if you run `ember g ember-cli-blanket` it will update your app to point to the correct blanket version.

### No Coverage Reported

1. Determine if coverage is being captured but not sent to ember server.
    1. Run tests with coverage enabled in browser - is it there?
        1. If not, check the `antiFilter` in `blanket-options.js` See [Projects with names including template](https://github.com/sglanzer/ember-cli-blanket/issues/109)
        1. If not, set the option `cliOptions: { debugCLI: true }` and rerun.  This will include additional diagnostics on covered and uncovered modules
        1. If so, continue to next step
    1. Check the network calls for `/write-blanket-coverage` - it is there?
        1. If not, are you using mirage or pretender? other ajax mocking?
            1. If so, see [Reporters and Testing Mocks](#reporters-and-testing-mocks)
        1. If so, does it complete with status `200`?

In general, checking the console, increasing debug levels and observing behavior in the browser will help diagnose issues.

Be sure to include versions of Ember, ember-cli and ember-cli-blanket when reporting issues.        

## License

MIT

## Release History

* 0.9.0
Significant bug fixes to support ember-cli > 1.13.8 thanks to @jschilli

* 0.8.0  
Support for multi-reporter output thanks to @job13er

* 0.7.0  
New HTML coverage reporter thanks to @yagni

* 0.6.2  

Bugfix release

* 0.6.1  
New TeamCity coverage reporter thanks to @calderas!

* 0.6.0

Upgraded to ember-cli 1.13.8  
Reduced the project dependencies

* 0.5.3

Various bugfixes - thanks to everyone for keeping this project moving forward!

* 0.5.2

QUnit users:
blanket-options now includes an autostart option (default true) to control the value of QUnit.config.autostart after the code coverage instrumentation is complete

* 0.5.0

Thanks to monumental effort from @jschilli the project now supports reporters and headless test runs.  Additionally, unit tests are now in place with continuous integration and the code base is much cleaner.  Amazing work Jeff!

* 0.4.0

Upgraded to ember-cli 0.2.2 @jschilli

* 0.3.4

Once again, Jeff Schilling keeps the project moving, this time annotating files that weren't instrumented in the extended requirejs loading.

* 0.3.3

Thanks again to Jeff Schilling, modules off the standard ember-cli require paths are now included in the coverage if the modules are included as imports.  For example, this means that utility function modules will now be included in the coverage.

* 0.3.2

Thanks to Jeff Schilling code coverage can be enabled/disabled in tests/blanket-options.js via the enableCoverage property.  This allows instrumentation to be turned off so that code debugging line numbers will line up.

For QUnit testing, turning off the 'Enable Coverage' flag in the HTML report will disable instrumentation.

For Mocha testing, appending ?coverage in the HTML report url will enable coverage, absence of this query parameter will disable coverage.

* 0.3.1

New installations will exclude templates from coverage by default.  If you wish to include templates in your coverage reports, modify tests/blanket-options.js to remove 'template' from the antifilter.

If you have an existing installation and wish to remove templates from coverage, modify your blanket-options.js to add 'template' to the antifilter, e.g.:
````
antifilter: ["//.*(tests|template).*/"]
````

* 0.3.0

Newer versions of ember-cli (tested against 0.1.15), which include newer versions of qunit,
call QUnit.start() and conflict with the QUnit.start() called in the ember-cli-blanket start.js,
so the QUnit.start() in start.js has been removed.

* 0.2.6

Added ember-cli-mocha support - thanks to Matt Heisig

Fixed the blanket report being hidden behind the ember test container - thanks to Steve Axthelm

* 0.2.5

Flagging additional keywords

* 0.2.4

Avoid instrumentation of any modules that don't contain the project modulePrefix

* 0.2.3

Resolving a release version collision with the npm published version

* 0.2.2

Upgraded to ember-cli 0.1.12

Removed unused dependencies installed in the standard ember-cli addon generation that were causing deprecation warnings.

* 0.2.1
