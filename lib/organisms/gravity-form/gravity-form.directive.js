(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    function lnOGravityForm() {
        return {
            restrict: 'A',
            transclude: true,
            templateUrl: 'lnPatterns/organisms/gravity-form/template.html',
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

    lnOGravityForm.$inject = [];

    angular
        .module('lnPatterns')
        .directive('lnOGravityForm', lnOGravityForm)
    ;


})();
