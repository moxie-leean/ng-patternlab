angular
  .module('lnPatterns')
  .service('lnMAdminBarService', lnMAdminBarService);

lnMAdminBarService.$inject = ['$rootScope', '$q', '$http', '$log'];

function lnMAdminBarService($rootScope, $q, $http, $log) {
  var apiUrl = '';

  return {
    setApiUrl: setApiUrl,
    getApiUrl: getApiUrl,
    getAdminBarData: getAdminBarData
  };

  ////////////////

  function setApiUrl(url) {
    apiUrl = url;
    $rootScope.$broadcast('lnMAdminBarUrlSet');
  }

  function getApiUrl() {
    return apiUrl;
  }

  function getAdminBarData() {
    var deferred = $q.defer();

    $http
      .get(apiUrl)
      .then(function (response) {
        return deferred.resolve(response);
      }, function (error) {
        $log.error('lnMAdminBarService.getAdminBarData() -> error: ', error);
        return deferred.reject(error);
      });

    return deferred.promise;
  }
}