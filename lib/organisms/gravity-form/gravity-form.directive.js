angular
    .module('lnPatterns')
    .directive('lnOGravityForm', lnOGravityForm);

/*@ngInject*/
function lnOGravityForm() {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: './ln-gravity-forms/template.html',
        //templateUrl: 'lnPatterns/organisms/gravity-form/template.html',
        scope: {},
        controller: 'lnOGravityFormController',
        controllerAs: '$ctrl',
        bindToController: {
            id: '@lnOGravityForm',
            onSubmit: '&lnSubmit',
            onError: '&lnError',
            loadFromAPI: '=lnLoadFromApi'
        }
    }
}

