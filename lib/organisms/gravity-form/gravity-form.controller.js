(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    function lnOGravityFormController($log, $scope, $element, $attrs, lnOGravityFormService) {
        $log.debug('lnOGravityFormController ->');

        var
            ctrl = this,
            formConfig
        ;

        // TODO: get this pulling successfully
        lnOGravityFormService.getForm(this.id)
            .then(function (response) {
                formConfig = response;
                console.log(response);
         });

        // Internal
        //

        var gatherFormData = function () {
            var formData = {
                "input_values": {}
            };

            if (!!$scope.inputs) {
                for (var i = 0; i < $scope.inputs.length; i++) {
                    var input = $scope.inputs[i];

                    if (!!input.name && input.name != '') {
                        formData.input_values[input.name] = input.value;
                    }
                }
            }

            return formData;
        };

        // Event Handlers
        //

        var _submit = function () {
            var data = gatherFormData();

            lnOGravityFormService
                .submit(ctrl.id, data)
                .then(_onSubmitted, _onError)
            ;
        };

        var _onSubmitted = function (response) {
            !!$attrs.gfSubmit
                ? ctrl.onSubmit({response: response})
                : $log.debug('lnOGravityFormController._onSubmit()->', response)
            ;
        };

        var _onError = function (error) {
            !!$attrs.gfError
                ? ctrl.onError({error: error})
                : $log.error('lnOGravityFormController._onError()->', error)
            ;
        };


        // Bindings
        //

        $element.on('submit', _submit);

        // Cleanup
        //

        var cleanup = function () {
            $element.off('submit', _submit);
        };

        $scope.$on('$destroy', cleanup);
    }

    lnOGravityFormController.$inject = ['$log', '$scope', '$element', '$attrs', 'lnOGravityFormService'];

    angular
        .module('lnPatterns')
        .controller('lnOGravityFormController', lnOGravityFormController)
    ;


})();
