Ember-cli-blanket
=========

[Blanket](http://blanketjs.org/) based code coverage for ember-cli applications

## Installation

Install the npm package:
```sh
npm install ember-cli-blanket --save-dev
```
Then run the ember-cli-blanket generater:

```sh
ember generate ember-cli-blanket
```

## Usage

Run `ember server`, navigate to the application url [/tests](http://localhost:4200/tests) (e.g. localhost:4200/tests) and select the "Enable coverage" checkbox.

A options file is available in tests/blanket-options.js that contains the current regex for data coverage (filter) the regex for exclusion from data coverage (antifilter) and an array of string to exclude from blanket's requirejs loader (loaderExclusions).  

As of release 0.2.4 loader exclusions are no longer necessary to fix conflicts with addon modules.  Loader exclusions may still be used to remove data coverage for specific files (e.g. config/environment).

## License

MIT

## Release History

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
