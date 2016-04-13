(function () {

    /**
     * Created by Chris on 13/04/2016.
     */

    'use strict';

    function lnOGravityFormConfigProvider() {
        var _config = null;

        this.setConfig = function (config) {
            _config = config;
        };

        this.$get = [function () {
            return _config;
        }];
    }

    lnOGravityFormConfigProvider.$inject =[];

    angular
        .module('ln-patterns')
        .provider('$lnOGravityFormConfig', lnOGravityFormConfigProvider)
    ;

})();
