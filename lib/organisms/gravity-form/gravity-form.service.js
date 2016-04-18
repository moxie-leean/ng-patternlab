angular
    .module('lnPatterns')
    .factory('lnOGravityFormService', lnOGravityFormService);

/*@ngInject*/
function lnOGravityFormService($http, $cacheFactory, $q, $log, $lnOGravityFormConfig, lnOGravityFormGETFormTransformer) {
    $log.debug('lnOGravityFormService ->', $lnOGravityFormConfig);

    /**
     * NOTE: This - along with other Auth processes - would normally go in an Interceptor, but as
     * this component is effectively sharing a module with a whole bunch of other components,
     * we don't know what effect that might have in the future if other components need to make HTTP requests....
     */
    function formatAPIAuthParams(key, sig, expires) {
        return '/?api_key=' + key + '&signature=' + sig + '&expires=' + expires;
    }

    function query(method, endpoint, params, clearCache, configParams, requiresAuth) {

        if (!$lnOGravityFormConfig || !$lnOGravityFormConfig.isValid) {
            alert("There is a problem! Please make sure Gravity Form API parameters have been set!");
            return;
        }

        if (clearCache === true) {
            var httpCache = $cacheFactory.get('$http'),
                getParams = '';

            if (method === 'GET' && !!params) {
                /**
                 * NOTE: Make sure we append any params here to make sure we actually return the
                 * full GET Url path, otherwise we never actually clear the cache properly in the instance
                 * that we have a GET Url to clear with params attached.
                 */
                getParams = '?';
                for (var key in params) {
                    getParams = getParams + key + '=' + params[key];
                }
            }

            httpCache.remove($lnOGravityFormConfig.url + endpoint + getParams);
        }

        // TODO: implement pre-flight method call or API request for valid signature
        requiresAuth = requiresAuth !== false;

        // NOTE: Hardcding in sig and exp values for the minute test with:
        // sig: MbgGfhcBR2qWPVV5OAT0u0uhyuw=
        // expires: 1460817129
        var config = {
            method: method,
            url: $lnOGravityFormConfig.url + endpoint + (requiresAuth ? formatAPIAuthParams($lnOGravityFormConfig.key, 'MbgGfhcBR2qWPVV5OAT0u0uhyuw=', '1460817129') : ''),
            cache: true,
            headers: {
                'Content-Type': 'application/json'
            }
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
            return deferred.resolve(response);
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
            var config = {
                transformResponse: lnOGravityFormGETFormTransformer
            };
            return query('GET', endpoint, null, null, config, true);
        }
        ,

        submit: function (formId, formData) {
            var endpoint = '/forms/' + formId + '/submissions';
            var params = formData;

            // We wrap this in an extra promise as the GF Web API
            // return a 200 response header even if the form isn't submitted properly, or it fails
            // for some reason on the server side (required fields missing, for instance)
            // by wrapping in an extra promise here we can check the success / error state in the response object
            // that is provided without cluttering the controller too much
            var deferred = $q.defer();
            query('POST', endpoint, params, null, null, false)
                .then(
                    function (response) {
                        if (!!response.data.status && response.data.status === 200) {
                            // response status is good, check to see if submission has failed on other criteria
                            if (response.data.response.is_valid === true) {
                                return deferred.resolve(response);
                            }
                        }
                        return deferred.reject(response);
                    },
                    function (error) {
                        return deferred.reject(error);
                    }
                );
            return deferred.promise;
        }
        ,

    };
}