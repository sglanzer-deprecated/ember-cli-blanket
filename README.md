Ember-cli-blanket
=========

Blanket code coverage for ember-cli applications

## Installation

  npm install ember-cli-blanket --save-dev

  ember generate ember-cli-blanket

## Usage

  Run "ember server", navigate to the application url /tests (e.g. localhost:4200/tests) and select the "Enable coverage" checkbox.
  
  Note that until some issues are fixed the coverage will only apply to non-route elements with "route" in the name (e.g. ember generate controller myroute).  If you want other coverage, play with the blanket-options "filter" property.

## License

MIT

## Release History

* 0.0.1 Beta
