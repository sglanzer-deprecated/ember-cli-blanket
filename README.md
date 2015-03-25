Ember-cli-blanket
=========

[Blanket](http://blanketjs.org/) based code coverage for ember-cli applications

## Installation

Install the addon:
```sh
ember install:addon ember-cli-blanket
```

## Usage

Run `ember server`, navigate to the application url [/tests](http://localhost:4200/tests) (e.g. localhost:4200/tests) and select the "Enable coverage" checkbox.

A options file is available in tests/blanket-options.js that contains the current regex for data coverage (filter) the regex for exclusion from data coverage (antifilter) and an array of string to exclude from blanket's requirejs loader (loaderExclusions).

As of release 0.2.4 loader exclusions are no longer necessary to fix conflicts with addon modules.  Loader exclusions may still be used to remove data coverage for specific files (e.g. config/environment).

## License

MIT

## Release History

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
