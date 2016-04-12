angular
    .module('lnPatterns')
    .component('lnOGravityForm', lnOGravityForm);


var lnOGravityForm = {
    restrict: 'E',
    replace: true,
    templateUrl: 'lnPatterns/organisms/gravity-form/template.html',
    controller: 'lnOGravityFormController as vm',
    bindings: {
        id: '<',
        token: '<',
        data: '<'
    }
};
