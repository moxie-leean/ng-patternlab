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
  var config;
  
  
  // Public
  //
  
  self.$get = [function () {
    return angular.copy(config);
  }];
  
  self.setConfig = function (data) {
    config = data;
    config.isValid = checkConfig();
  };
  
  
  // Internal
  //
  
  function checkConfig() {
    var _valid = true;
    for (var i = 0; i < REQUIRED_KEYS.length; i++) {
      var prop = config[REQUIRED_KEYS[i]];
      
      if (angular.isUndefined(prop)) {
        _valid = false;
        break;
      }
    }
    return _valid;
  }
}
