

module.exports.policies = {
  '*': true,

  'user': {
    'history': ['jwtAuth']
  }
};
