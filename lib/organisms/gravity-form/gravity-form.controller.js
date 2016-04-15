(function () {

    /**
     * Created by Chris on 12/04/2016.
     */

    'use strict';


    function lnOGravityFormController($log, $scope, $element, $attrs, $sce, lnOGravityFormService) {
        $log.debug('lnOGravityFormController ->');

        var
            ctrl = this
        ;

        this.submitDisabled = false;


        lnOGravityFormService.getForm(this.id)
            .then(function (response) {
                $log.debug(response);
                ctrl.formHTMLValid = response.data.isValid;
                ctrl.formHTML = $sce.trustAsHtml(response.data.html)
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

            ctrl.submitDisabled = true;

            lnOGravityFormService
                .submit(ctrl.id, data)
                .then(_onSubmitted, _onError)
            ;
        };

        var _onSubmitted = function (response) {
            ctrl.submitDisabled = false;

            !!$attrs.gfSubmit
                ? ctrl.onSubmit({response: response})
                : $log.debug('lnOGravityFormController._onSubmit()->', response)
            ;
        };

        var _onError = function (error) {
            ctrl.submitDisabled = false;

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

    lnOGravityFormController.$inject = ['$log', '$scope', '$element', '$attrs', '$sce', 'lnOGravityFormService'];

    angular
        .module('lnPatterns')
        .controller('lnOGravityFormController', lnOGravityFormController)
    ;


})();
