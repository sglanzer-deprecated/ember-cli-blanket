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

## Reporters

ember-cli-blanket can output coverage data to a file.

Three reporters are currently supported:

- json - provides summary and file level statistics
- lcov - provides a basic lcov formatted file
- teamcity - provides a total summary statistics for teamcity

Reporters have default output destinations and this can be overwritten in the `blanket-options.js` file, which is auto-installed in your `tests` folder.

```js
var options = {
...
    cliOptions: {
      jsonOptions: {
        outputFile: 'test-output.json' // default is 'coverage.json'
      },
      lcovOptions: {
        outputFile: 'lcov.dat',
        //provide a function to rename es6 modules to a file path
        renamer: function(moduleName){
          var expression = /^APP_NAME/;
          return moduleName.replace(expression, 'app') + '.js';
        }
      },
      reporters: ['json']
    }
  };
```

Only a single reporter is supported currently.

Append ```?coverage``` to the HTML report URL to enable coverage. This option will enable the creation of the coverage data file when running within a continuous integration context.

You can add this as part of the ```ember test``` command for a single run:

```bash
ember test --test-page='tests/index.html?coverage'
```

or it can be specified within testem.json for use everytime you test:

```js
{
...
  'test_page': 'tests/index.html?coverage',
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

For ember-cli-mirage add this to your config.js

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

## License

MIT

## Release History

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
