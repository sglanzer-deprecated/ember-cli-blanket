'use strict';

var fs = require('fs-extra');

function exists(path) {
  return fs.existsSync(path);
}

function isCurrentFormat(path) {
  if (exists(path)) {
    var contents = fs.readFileSync(path, 'utf8');
    return contents.match(/module.exports/) !== null;
  }
  throw new Error('blanket options file at ' + path + ' does not exist');
}

module.exports = {
  exists: exists,
  isCurrentFormat: isCurrentFormat
};
