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
    var
        REQUIRED_KEYS = [
            'api_base',
            'api_key',
            'forms'
        ],
        self = this,
        _config = null
    ;

    this.setConfig = function (config) {
        _config = config;
        _config.isValid = self.hasValidConfig();
    };

    this.hasValidConfig = function () {
        var _hasParams = true;
        for (var i = 0; i < REQUIRED_KEYS.length; i++) {
            var prop = _config[REQUIRED_KEYS[i]];

            if (typeof prop === "undefined") {
                _hasParams = false;
                break;
            }
        }
        return _hasParams;
    };

    
    // Public
    //
    
    this.$get = [function () {
        return angular.copy(_config);
    }];
}
