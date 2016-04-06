/*** TEMPLATE FOR GENERATING - ngControllers.js - WHICH WILL CONTAIN ALL PARAMETERS FOR EXAMPLES ***/

angular
  .module('lnPatterns')
  .controller('lnController', ['$scope', function($scope) {
    //TODO
  }])
  {CONTROLLER}
  .controller('{CONTROLLER_NAME}', ['$scope', function($scope) {
    var attributes = JSON.parse('{CONTROLLER_ATTRIBUTES}');
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key))
        $scope[key] = attributes[key];
    }
  }])
  {END_CONTROLLER}
;