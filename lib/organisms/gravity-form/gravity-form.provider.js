angular
  .module('lnPatterns')
  .provider('$lnOGravityFormConfig', lnOGravityFormConfigProvider);

/**
 *
 * Expects: {
 *      api_base: 'http://www.urltoapi.com/api',
 *      api_key: 'public-api-key',
 *      forms: {
 *          '1': {
 *              'get_form': {
 *                  'route': 'forms/1',
 *                  'signature: 'serverGeneratedSignatureString',
 *                  'expires: 'serverGeneratedExpiresTimestamp'
 *              },
 *              'post_submission: {
 *                  'route': 'forms/1/submissions'
 *              }
 *          },
 *          '2': {
 *              ...
 *          },
 *          ...
 *      }
 *  }
 */

/*@ngInject*/
function lnOGravityFormConfigProvider() {
  var REQUIRED_KEYS = ['api_base', 'api_key', 'forms'];
  var self = this;

  angular.extend(self, {
    config: null
  });

  // Public
  //

  this.$get = [function () {
    angular.copy(self.config);
  }];

  // Internal
  //

  this.setConfig = function (config) {
    self.config = config;
    self.config.isValid = self.checkConfig();
  };

  this.checkConfig = function () {
    var _valid = true;
    for (var i = 0; i < REQUIRED_KEYS.length; i++) {
      var prop = self.config[REQUIRED_KEYS[i]];

      if (angular.isUndefined(prop)) {
        _valid = false;
        break;
      }
    }
    return _valid;
  };


}
