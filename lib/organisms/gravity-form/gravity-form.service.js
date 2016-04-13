(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    function lnOGravityFormService($http, $cacheFactory, $q, $log, $lnOGravityFormConfig) {
        $log.debug('lnOGravityFormService->', $lnOGravityFormConfig);

        // Internal
        //

        function formatRequiredAPIParams() {
            return '/?api_key=' + $lnOGravityFormConfig.apiKey + '&signature=' + $lnOGravityFormConfig.signature + '&expires=' + $lnOGravityFormConfig.expires;
        }

        function query(method, endpoint, params, clearCache, configParams, requiresAuth) {

            if (clearCache === true) {
                var httpCache = $cacheFactory.get('$http'),
                    getParams = '';

                if (method === 'GET' && !!params) {
                    // NOTE: Make sure we append any params here to make sure we actually return the
                    //       full GET Url path, otherwise we never actually clear the cache properly in the instance
                    //       that we have a GET Url to clear with params attached.
                    getParams = '?';
                    for (var key in params) {
                        getParams = getParams + key + '=' + params[key];
                    }
                }

                httpCache.remove($lnOGravityFormConfig.apiUrl + endpoint + getParams);
            }

            requiresAuth = requiresAuth !== false;

            var config = {
                method: method,
                url: $lnOGravityFormConfig.apiUrl + endpoint + ( (requiresAuth === true) ? formatRequiredAPIParams() : '' ),
                cache: true
            };

            if (!!configParams) {
                angular.extend(config, configParams);
            }

            switch (method) {
                case 'GET':
                    config.params = params;
                    break;
                default:
                    config.data = params;
            }

            var deferred = $q.defer();

            $http(config).then(function (response) {
                return deferred.resolve(response.data);
            }, function (error) {
                $log.error('lnOGravityFormService.query() -> config: ', config, ' endpoint: ', endpoint, ' error:', error);
                return deferred.reject(error);
            });

            return deferred.promise;
        }

        // Public API
        //

        return {

            // TODO
            getFormConfig: function(formId) {
                return {};
            }
            ,

            submit: function (formId, formData) {
                var endpoint = '/forms/' + formId + '/submissions';
                var params = formData;

                return query('POST', endpoint, params, null, null, false);
            }
            ,
        };
    }

    lnOGravityFormService.$inject = ['$http', '$cacheFactory', '$q', '$log', '$lnOGravityFormConfig'];

    angular
        .module('ln-patterns')
        .factory('lnOGravityFormService', lnOGravityFormService)
    ;


})();
