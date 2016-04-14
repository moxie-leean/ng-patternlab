(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    function lnOGravityFormService($http, $cacheFactory, $q, $log, $lnOGravityFormConfig) {
        $log.debug('lnOGravityFormService ->', $lnOGravityFormConfig);


        // Internal
        //


        function formatAPIAuthParams(key, sig, expires) {
            return '/?api_key=' + key + '&signature=' + sig + '&expires=' + expires;
        }

        function query(method, endpoint, params, clearCache, configParams, requiresAuth) {

            if (!$lnOGravityFormConfig.isValid) {
                alert("There is a problem! Please make sure API parameters have been set!");
                return;
            }

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

                httpCache.remove($lnOGravityFormConfig.url + endpoint + getParams);
            }

            // TODO: implement pre-flight method call or API request for valid signature
            //       might be best in a request interceptor
            requiresAuth = requiresAuth !== false;

            // requiresAuth here is temp...
            var config = {
                method: method,
                url: $lnOGravityFormConfig.url + endpoint + (requiresAuth ? formatAPIAuthParams($lnOGravityFormConfig.key, '', '') : ''),
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

            getForm: function (formId) {
                var endpoint = '/forms/' + formId;
                return query('GET', endpoint, null, null, null, false);
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
