(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';

    var FORM_INPUTS = ['input', 'textarea'];

    function lnOGravityFormController($log, $attrs, $element, lnOGravityFormService) {
        var
            ctrl,
            inputElements
        ;


        // Lifecycle hooks
        //


        this.$onInit = function () {
            $log.debug('lnOGravityFormController.$onInit()');

            ctrl = this;

            ctrl.config = lnOGravityFormService.getFormConfig(ctrl.id);
            ctrl.hasSubmit = false;
         };

        this.$postLink = function() {
            $log.debug('lnOGravityFormController.$postLink()');

            inputElements = getInputElements();
            ctrl.hasSubmit = checkSubmitButton();
        };


        // Internal
        //

        var getInputElements = function() {
            var _elements = [];

            for (var i = 0; i < FORM_INPUTS.length; i++) {
                _elements.push($element.find(FORM_INPUTS[i])[0]);
            }

            return [].concat.apply([], _elements);
        };

        var checkSubmitButton = function() {
            var _inputs = $element.find('input');
            var _hasSubmit = false;

            for (var i = 0; i < _inputs.length; i++) {
                if (_inputs[i].type === "submit") {
                    _hasSubmit = true;
                    break;
                }
            }

            return _hasSubmit;
        };

        var gatherFormData = function () {
            var
                formData = {
                    "input_values": {}
                }
            ;

            for (var i = 0; i < inputElements.length; i++) {
                var input = inputElements[i];

                if(!! input.name && input.name != '') {
                    formData.input_values[input.name] = input.value;
                }
            }

            return formData;
        };

        // Event Handlers
        //

        var _onSubmit = function (response) {
            !!$attrs.onSubmit
                ? ctrl.onSubmit({response: response})
                : $log.debug('lnOGravityFormController._onSubmit()->', response)
            ;
        };

        var _onError = function (error) {
            !!$attrs.onError
                ? ctrl.onError({error: error})
                : $log.error('lnOGravityFormController._onError()->', error)
            ;
        };


        // Public API
        //


        this.submit = function () {
            var data = gatherFormData();
            $log.debug('lnOGravityFormController.submit()->', ctrl.id, data);

            lnOGravityFormService
                .submit(ctrl.id, data)
                .then(_onSubmit, _onError)
            ;
        }
    }

    lnOGravityFormController.$inject = ['$log', '$attrs', '$element', 'lnOGravityFormService'];

    angular
        .module('ln-patterns')
        .controller('lnOGravityFormController', lnOGravityFormController)
    ;


})();
