/*jshint expr: true */
var blanketOptions = require('../../lib/blanket-options');
var expect = require('chai').expect;
var path = require('path');
var root = process.cwd();
var tmp = require('tmp-sync');
var mkdirp = require('fs-extra').mkdirpSync;
var fs = require('fs-extra');
var tmproot = path.join(root, 'tmp');

describe('Blanket options file', function() {
  var tmpdir, oldOptions;

  beforeEach(function() {
    oldOptions = fs.readFileSync(path.join(__dirname, '..','fixtures','old-school-options.js'), 'utf8');

    tmpdir = tmp.in(tmproot);
    process.chdir(tmpdir);
    mkdirp('tests');
  });

  it('should detect no options file', function() {
    expect(blanketOptions.exists('tests/blanket-options.js')).to.not.be.ok;
  });

  it('should detect no options file when checking format', function() {
    expect(function() {
      blanketOptions.isCurrentFormat('tests/blanket-options.js');
    }).to.throw('blanket options file at tests/blanket-options.js does not exist');
  });

  it('should detect old format options file', function() {
    fs.writeFileSync(path.join('tests','blanket-options.js'), oldOptions);
    expect(blanketOptions.exists('tests/blanket-options.js')).to.be.ok;
    expect(blanketOptions.isCurrentFormat('tests/blanket-options.js')).to.not.be.ok;
  });

});
