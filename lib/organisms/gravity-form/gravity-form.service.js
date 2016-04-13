(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    // TEMP DATA - TODO: retrieve these from Lean Static
    var
        apiUrl = 'http://wp.skaled.moxie-staging.com/wp-admin/gravityformsapi',
        apiKey = 'a53cef0349',
        signature = 'oRSC5ZqHpBf8Rxvm5hHPOWsIDU0%3D',
        expires = '1460631359'
    ;
    // --

    function lnOGravityFormService($http, $cacheFactory, $q, $log) {
        $log.debug('lnOGravityFormService->');

        // Internal
        //

        function formatRequiredAPIParams() {
            return '/?api_key=' + apiKey + '&signature=' + signature + '&expires=' + expires;
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

                httpCache.remove(apiUrl + endpoint + getParams);
            }

            requiresAuth = requiresAuth !== false;

            var config = {
                method: method,
                url: apiUrl + endpoint + ( (requiresAuth === true) ? formatRequiredAPIParams() : '' ),
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

            submit: function (formId, formData) {
                var endpoint = '/forms/' + formId + '/submissions';
                var params = formData;

                return query('POST', endpoint, params, null, null, false);
            }

        };
    }

    lnOGravityFormService.$inject = ['$http', '$cacheFactory', '$q', '$log'];

    angular
        .module('ln-patterns')
        .factory('lnOGravityFormService', lnOGravityFormService)
    ;


})();
