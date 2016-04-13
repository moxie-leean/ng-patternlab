(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    function lnOGravityFormController($log, $attrs, $element, lnOGravityFormService) {
        var ctrl;


        // Lifecycle hooks
        //


        this.$onInit = function () {
            $log.debug('lnOGravityFormController.$onInit() -> $element: ', $element);
            ctrl = this;
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
                },
                elements = $element.find('input');

            for (var i = 0; i < elements.length; i++) {
                var input = elements[i];

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
