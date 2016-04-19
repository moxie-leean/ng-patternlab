angular
  .module('lnPatterns')
  .directive('lnOGravityForm', lnOGravityForm);

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
  }
}

