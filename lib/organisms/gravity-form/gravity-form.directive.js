(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    var FORM_INPUTS = ['input', 'textarea'];

    function lnOGravityForm($compile) {
        return {
            restrict: 'A',
            transclude: true,
            templateUrl: 'organisms/gravity-form/template.html',
            scope: {},
            controller: 'lnOGravityFormController',
            controllerAs: '$ctrl',
            bindToController: {
                id: '@lnOGravityForm',
                onSubmit: '&lnSubmit',
                onError: '&lnError'
            },
            link: function (scope, element) {

                // Setup
                //

                var getInputElements = function () {
                    var _elements = [];

                    for (var i = 0; i < FORM_INPUTS.length; i++) {
                        var tag = FORM_INPUTS[i];
                        _elements.push(element.find(tag)[0]);
                    }

                    return [].concat.apply([], _elements);
                };

                var checkSubmitButton = function () {
                    var _inputs = element.find('input');
                    var _hasSubmit = false;

                    for (var i = 0; i < _inputs.length; i++) {

                        if (_inputs[i].type === "submit") {
                            _hasSubmit = true;
                            break;
                        }
                    }

                    return _hasSubmit;
                };

                var addSubmit = function () {
                    var el = angular.element('<input type="submit" ng-disabled="$ctrl.submitDisabled" ng-if="$ctrl.formHTMLValid">');
                    $compile(el)(scope);
                    element.append(el);
                };


                // Init
                //


                scope.inputs = getInputElements();

                if (!checkSubmitButton()) {
                    addSubmit();
                }
            }
        }
    }

    lnOGravityForm.$inject = ['$compile'];

    angular
        .module('lnPatterns')
        .directive('lnOGravityForm', lnOGravityForm)
    ;


})();
