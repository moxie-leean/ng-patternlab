angular
    .module('lnPatterns')
    .controller('lnOGravityFormController', lnOGravityFormController);

/*@ngInject*/
function lnOGravityFormController($log, $scope, $element, $attrs, $sce, lnOGravityFormService) {

    var
        FORM_INPUTS = [
            'input', 'textarea', 'select', 'datalist', 'keygen'
        ],
        vm = this,
        inputs = undefined
        ;

    vm.form = $element[0];
    vm.submitDisabled = false;


    var checkLoadFormResponse = function (response) {
        vm.formHTMLValid = response.data.isValid;
        vm.formHTML = $sce.trustAsHtml(response.data.html)
    };

    var getInputElements = function () {
        var _elements = [];

        for (var i = 0; i < FORM_INPUTS.length; i++) {
            var tag = FORM_INPUTS[i];
            var _inputs = $element.find(tag);

            if (!!_inputs && _inputs.length) {
                for (var j = 0; j < _inputs.length; j++) {
                    _elements.push(_inputs[j]);
                }
            }
        }

        return _elements;
    };

    // Clear value of object inside input fields after a submission
    var clearInputElements = function () {
        angular.forEach(inputs, function (val) {
            val.value = '';
        });
    };

    /*
     var highlightInputErrors = function (validationMessages) {
     for (var i in validationMessages) {
     var name = 'input_' + i;
     for (var j = 0; j < inputs.length; j++) {
     if (inputs[j].name === name) {
     if(!!inputs[j].placeholder) {
     inputs[j].placeholder = validationMessages[i];
     }
     continue;
     }
     }
     }
     };
     */

    var gatherFormData = function () {
        var formData = {
            'input_values': {}
        };

        inputs = getInputElements();

        if (!!inputs && inputs.length) {
            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];

                if (!!input.name && input.name != '') {

                    // Make sure we only get a selected radio button or checkbox
                    if ((input.type === 'radio' || input.type === 'checkbox') && !input.checked) {
                        continue;
                    }

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

        $log.debug('lnOGravityFormController._submit() -> ', data);
        vm.submitDisabled = true;

        lnOGravityFormService
            .submit(vm.id, data)
            .then(_onSubmitted, _onError)
        ;
    };

    var _onSubmitted = function (response) {
        $log.debug('lnOGravityFormController._onSubmitted()->', response);

        vm.submitDisabled = false;
        clearInputElements();

        if (!!$attrs.lnSubmit) {
            vm.onSubmit({response: response});
        }
    };

    var _onError = function (error) {
        $log.error('lnOGravityFormController._onError()->', error);

        vm.submitDisabled = false;
        clearInputElements();
        //highlightInputErrors(error.data.response.validation_messages);

        if (!!$attrs.lnError) {
            vm.onError({error: error});
        }
    };


    // Init
    //

    $log.debug('lnOGravityFormController -> ', this, '/ $element: ', $element);

    if (vm.loadFromAPI === true) {
        lnOGravityFormService.getForm(vm.id)
            .then(checkLoadFormResponse, checkLoadFormResponse);
    }


    vm.form.id = 'gform_' + vm.id;

    $element.on('submit', _submit);

    var cleanup = function () {
        $element.off('submit', _submit);
    };

    $scope.$on('$destroy', cleanup);
}
