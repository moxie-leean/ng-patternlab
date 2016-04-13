(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';

    // Bif of a kludge for the moment...
    var FORM_INPUT_TYPES = ["input", "textarea"];

    function lnOGravityFormController($log, $attrs, $element, lnOGravityFormService) {
        var
            ctrl,
            inputElements
        ;


        // Lifecycle hooks
        //


        this.$onInit = function () {
            $log.debug('lnOGravityFormController.$onInit() -> $element: ', $element);
            ctrl = this;
        };

        this.$postLink = function() {
            inputElements = [];
            for (var e = 0; e < FORM_INPUT_TYPES.length; e++) {
                inputElements.push($element.find(FORM_INPUT_TYPES[e])[0]);
            }
            inputElements = [].concat.apply([], inputElements);
        };


        // Internal
        //


        /**
         * TODO: see if it's possible to dynamically apply a an ng-model to transcluded content
         *       to avoid having to traverse all the DOM elements and get their values.
         */
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
            $log.debug('lnOGravityFormController.submit()->', this.id, data);

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
