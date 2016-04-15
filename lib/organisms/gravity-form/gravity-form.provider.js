(function () {

    /**
     * Created by Chris on 13/04/2016.
     */

    'use strict';

    /**
     *
     * Expects: {
     *      url: 'http://www.urltoapi.com/api',
     *      key: 'public-api-key',
     *
     *      TODO: decide if this:
     *        sigUrl: 'http://www.apitoretrievesignatureurl.com/'
     *      OR this:
     *        sigCallback: pointerToProvidedMethod
     *      is appropriate
     *  }
     */

    var REQUIRED_KEYS = [
        'url',
        'key',
        'sigUrl',
        'sigCallback'
    ];

    function lnOGravityFormConfigProvider() {
        var
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

        this.$get = [function () {
            return angular.copy(_config);
        }];
    }

    lnOGravityFormConfigProvider.$inject = [];

    angular
        .module('lnPatterns')
        .provider('$lnOGravityFormConfig', lnOGravityFormConfigProvider)
    ;

})();
