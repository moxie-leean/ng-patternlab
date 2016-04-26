angular
  .module('lnPatterns')
  .directive('lnOGravityForm', lnOGravityForm);

/**
 * TODO:
 *    - Expand the list of supported input types (see comments in form parser)
 *
 *    - NOTE: The validation feedback / update mechanism isn't very 'Angular'
 *      at the moment
 *
 *    - Migrate to use of ng-model for form data gathering
 */

lnOGravityForm.$inject = ['$compile'];

function lnOGravityForm($compile) {
  return {
    restrict: 'A',
    transclude: true,
    templateUrl: 'lnPatterns/organisms/gravity-form/template.html',
    scope: {},
    controller: 'lnOGravityFormController',
    controllerAs: 'vm',
    bindToController: {
      id: '@lnOGravityForm',
      onSubmit: '&lnSubmit',
      onError: '&lnError',
      loadFromAPI: '=lnLoadFromApi'
    },
    link: function link(scope, element) {
      var unbind = scope.$watch('formHTML', function (newHTML) {
        if (angular.isDefined(newHTML)) {
          var template = angular.element(newHTML);
          element.html(template[0]);
          $compile(element.contents())(scope);
        }
      });

      scope.$on('$destroy', function () {
        unbind();
      });

    }
  };
}


