angular
    .module('lnPatterns')
    .factory('lnOGravityFormService', lnOGravityFormService);

/*@ngInject*/
function lnOGravityFormService($http, $cacheFactory, $q, $log, $lnOGravityFormConfig, lnOGravityFormGETFormTransformer) {
    $log.debug('lnOGravityFormService ->', $lnOGravityFormConfig);

    function getFormParams(formId) {
        var form = $lnOGravityFormConfig.forms[formId];
        if (typeof form === "undefined") {
            $log.error('lnOGravityFormService.formatAPIAuthParams() -> form ID: ', formId, ' not found in config!');
            return {};
        }
        return form;
    }

    function formatAPIAuthParams(form) {
        return {
            api_key: $lnOGravityFormConfig.api_key,
            signature: form.signature,
            expires: form.expires
        };
    }

    function checkTrailingSlash(url) {
        var _u = angular.copy(url);
        if (_u.substr(-1) != '/') {
            _u += '/';
        }
        return _u;
    }

    function query(method, endpoint, params, clearCache, configParams) {

        if (!$lnOGravityFormConfig || !$lnOGravityFormConfig.isValid) {
            $log.error("lnOGravityFormService.query() -> Please make sure Gravity Form API parameters have been set!");
            return;
        }

        var _baseUrl = checkTrailingSlash($lnOGravityFormConfig.api_base);

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

            httpCache.remove(_baseUrl + endpoint + getParams);
        }

        var config = {
            method: method,
            url: _baseUrl + endpoint,
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
            var _f = getFormParams(formId).get_form,
                endpoint = _f.route,
                params = formatAPIAuthParams(_f),
                config = {
                    transformResponse: lnOGravityFormGETFormTransformer
                }
            ;

            return query('GET', endpoint, params, false, config);
        }
        ,

        submit: function (formId, formData) {
            var
                _f = getFormParams(formId).post_submission,
                endpoint = _f.route,
                params = formData
            ;

            // We wrap this in an extra promise as the GF Web API returns a 200 response header
            // even if the form isn't submitted properly, or it fails
            // for some reason on the server side (required fields missing, or a validation error for instance)
            var deferred = $q.defer();
            query('POST', endpoint, params)
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

    };
}