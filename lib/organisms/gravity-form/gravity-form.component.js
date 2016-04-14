(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    var lnOGravityForm = {
        restrict: 'E',
        templateUrl: './ln-gravity-forms/template.html',
        controller: 'lnOGravityFormController',
        transclude: true,
        bindings: {
            id: '@formId',
            onSubmit: '&onSubmit',
            onError: '&onError'
        }
    };

    angular
        .module('ln-patterns')
        .component('lnOGravityForm', lnOGravityForm)
    ;

  
})();
