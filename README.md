Ember-cli-blanket
=========

[Blanket](http://blanketjs.org/) based code coverage for ember-cli applications

## Installation

* `git clone` this repository
  npm install ember-cli-blanket --save-dev

  ember generate ember-cli-blanket

## Usage

  Run "ember server", navigate to the application url /tests (e.g. localhost:4200/tests) and select the "Enable coverage" checkbox.
  
  A options file is available in tests/blanket-options.js that contains the current regex for data coverage (filter) the regex for exclusion from data coverage (antifilter) and an array of string to exclude from blanket's requirejs loader (loaderExclusions).  The loaderExclusions are intended to address current corner cases, such as services/initializers that attempt to register more than once; the exclusions may also be used to remove data coverage for specific files (e.g. config/environment).

## License

MIT

## Release History

* 0.2.2

- Upgraded to ember-cli 0.1.12
- Removed unused dependencies installed in the standard ember-cli addon generation that were causing deprecation warnings.

* 0.2.1
