/*** TEMPLATE FOR GENERATING - ngControllers.js - WHICH WILL CONTAIN ALL PARAMETERS FOR EXAMPLES ***/

angular
  .module('lnPatterns')
  .controller('lnPatternsController', ['$scope', '$sce', function($scope, $sce) {
    $scope.changeExample = function(exampleId) {
      $scope.currentExampleUrl = $sce.trustAsResourceUrl('/#/examples/' + exampleId);
    };
  }])
  {CONTROLLER}
  .controller('{CONTROLLER_NAME}', ['$scope', '$location', function($scope, $location) {
    var attributes = JSON.parse('{CONTROLLER_ATTRIBUTES}');
    for (var key in attributes) {
      if (attributes.hasOwnProperty(key))
        $scope[key] = attributes[key];
    }
    var urlArray = $location.path().split('/');
    var example = urlArray.length > 0 ? urlArray.pop() : '';
    $scope.show = (example == '{EXAMPLE_ID}');
  }])
  {END_CONTROLLER}
;