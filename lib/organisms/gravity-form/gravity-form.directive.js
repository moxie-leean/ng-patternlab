angular
  .module('lnPatterns')
  .directive('lnOGravityForm', lnOGravityForm);

/**
 * TODO:
 *    - Expand the list of supported input types (see comments in form parser)
 *    - $compile the parsed form HTML properly into the directive $scope to:
 *        - enable use of ng-* directives (e.g. ng-show/hide, ng-messages etc)
 *        - remove manual updates of elements from controller
 *
*     - NOTE: The validation feedback / update mechanism isn't very 'Angular'
 *      at the moment (see above)
 */

/*@ngInject*/
function lnOGravityForm() {
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
    }
  };
}

