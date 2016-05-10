angular
  .module('lnPatterns')
  .factory('lnMAdminBarService', lnMAdminBarService);

lnMAdminBarService.$inject = ['$rootScope', '$q', '$http'];

function lnMAdminBarService($rootScope, $q, $http) {
  var apiUrl = '';

  return {
    setApiUrl: setApiUrl,
    getApiUrl: getApiUrl,
    getAdminBarData: getAdminBarData
  };

  ////////////////

  function setApiUrl(url) {
    apiUrl = url;
  }

  function getApiUrl() {
    return apiUrl;
  }

  function getAdminBarData() {
    var deferred = $q.defer();

    $http
      .get(apiUrl, { withCredentials: true })
      .then(function (response) {
        return deferred.resolve(response);
      }, function (error) {
        return deferred.reject(error);
      });

    return deferred.promise;
  }
}