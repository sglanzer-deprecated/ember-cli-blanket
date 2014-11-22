/* globals module */

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('blanket', '~1.1.5');
  }
};
