angular
  .module('lnPatterns')
  .factory('lnOGravityFormService', lnOGravityFormService);

/*@ngInject*/
function lnOGravityFormService($http, $cacheFactory, $q, $log, $rootScope, $lnOGravityFormConfig, lnOGravityFormTransformer) {
  var localConfig;

  // Public API
  //

  return {
    setConfig: setConfig,
    getConfig: getConfig,
    getForm: getForm,
    submit: submit
  };

  function setConfig(data) {
    localConfig = data;
    $rootScope.$broadcast('lnOGravityFormConfigUpdated');
  }

  // Local config setting takes precedence over anything provided in the config phase
  function getConfig() {
    if (angular.isDefined(localConfig)) {
      return angular.copy(localConfig);
    }
    return $lnOGravityFormConfig;
  }

  function getForm(formId) {
    var _form = getFormParams(formId).get_form;
    var endpoint = _form.route;
    var params = formatAPIAuthParams(_form);
    var config = {
      transformResponse: lnOGravityFormTransformer
    };

    return query('GET', endpoint, params, false, config);
  }

  function submit(formId, formData) {
    var _form = getFormParams(formId).post_submission;
    var endpoint = _form.route;
    var params = formData;

    /**
     * We wrap this in an extra promise as the GF Web API returns a 200 response header
     * even if the form isn't submitted properly, or it fails
     * for some reason on the server side (required fields missing, or a validation error for instance)
     * */
    var deferred = $q.defer();
    query('POST', endpoint, params)
      .then(
        function (response) {
          if (!!response.data.status
            && response.data.status === 200
            && response.data.response.is_valid === true) {
            // response status is good and hasn't failed on any field or validation criteria
            return deferred.resolve(response);
          }
          // In all other cases, response is a failure, so we pass this on as an error.
          return deferred.reject(response);
        },
        function (error) {
          return deferred.reject(error);
        }
      );
    return deferred.promise;
  }


  // Internal
  //

  function getFormParams(formId) {
    var form = getConfig().forms[formId];

    if (angular.isUndefined(form)) {
      $log.error('lnOGravityFormService.formatAPIAuthParams() -> form ID: ', formId, ' not found in config!');
      return;
    }

    return form;
  }

  function formatAPIAuthParams(form) {
    return {
      api_key: getConfig().api_key,
      signature: form.signature,
      expires: form.expires
    };
  }

  function checkTrailingSlash(url) {
    var _url = angular.copy(url);
    if (_url.substr(-1) !== '/') {
      _url += '/';
    }
    return _url;
  }

  function query(method, endpoint, params, clearCache, configParams) {
    $log.debug('lnOGravityFormService.query() ->', method, endpoint);

    var _apiConfig = getConfig();

    if (angular.isUndefined(_apiConfig)) {
      $log.error('lnOGravityFormService.query() -> Please make sure Gravity Form API parameters have been set!');
      return;
    }

    var _baseUrl = checkTrailingSlash(_apiConfig.api_base);

    if (clearCache === true) {
      var httpCache = $cacheFactory.get('$http');
      var getParams = '';

      if (method === 'GET' && !!params) {
        /**
         * NOTE: Make sure we append any params here to make sure we actually return the
         * full GET Url path, otherwise we never actually clear the cache properly in the instance
         * that we have a GET Url to clear with params attached.
         */
        getParams = '?';
        for (var key in params) {
          if (params.hasOwnProperty(key)) {
            getParams = getParams + key + '=' + params[key];
          }
        }
      }

      httpCache.remove(_baseUrl + endpoint + getParams);
    }

    var requestConfig = {
      method: method,
      url: _baseUrl + endpoint,
      cache: true,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (configParams) {
      angular.extend(requestConfig, configParams);
    }

    switch (method) {
      case 'GET':
        requestConfig.params = params;
        break;
      default:
        requestConfig.data = params;
    }

    var deferred = $q.defer();

    $http(requestConfig).then(function (response) {
      return deferred.resolve(response);
    }, function (error) {
      $log.error('lnOGravityFormService.query() -> config: ', requestConfig, ' endpoint: ', endpoint, ' error:', error);
      return deferred.reject(error);
    });

    return deferred.promise;
  }

}
