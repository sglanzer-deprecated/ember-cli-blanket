module.exports = {

  name: 'ember-cli-blanket',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('blanket', '~1.1.5');
  }
};
