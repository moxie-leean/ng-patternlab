angular
  .module('lnPatterns')
  .controller('lnOGravityFormController', lnOGravityFormController);

lnOGravityFormController.$inject = ['$window', '$log', '$scope', '$element', '$attrs', '$sce', '$cookies', '$location', 'lnOGravityFormService', 'lnOGravityValidationParser', 'lnOGravityFormDataParser'];

function lnOGravityFormController($window, $log, $scope, $element, $attrs, $sce, $cookies, $location, lnOGravityFormService, lnOGravityValidationParser, lnOGravityFormDataParser) {
  var FORM_INPUTS = ['input', 'textarea', 'select', 'datalist', 'keygen'];
  var vm = this;
  var inputs;
  var validationBlocks;

  // Public API
  //

  angular.extend(vm, {
    $scope: $scope,
    form: $element[0],
    formModel: {}, // This is used purely for form validation on the client side
    formData: {},
    formSubmitted: false,
    submitDisabled: false
  });


  // Internal
  //

  if (angular.isUndefined(lnOGravityFormService.getConfig())) {
    var unbindInit = $scope.$on('lnOGravityFormConfigUpdated', init);
  } else {
    init();
  }

  function init() {
    if (angular.isDefined(unbindInit)) {
      unbindInit();
    }

    if (vm.loadFromAPI) {
      lnOGravityFormService.getForm(vm.id)
        .then(_checkLoadFormResponse, _checkLoadFormResponse);
    }

    $element.on('submit', _submit);
    $scope.$on('$destroy', _cleanup);
  }


  // Event Handlers
  //

  function _checkLoadFormResponse(response) {
    if (response.data.isValid) {
      vm.form.name = response.data.formName;
      vm.form.id = response.data.formId;

      if ($window.$) {
        vm.$scope.formHTML = '<div>' + response.data.html + response.data.confirmationHtml + '</div>';
      } else {
        vm.$scope.formHTML = $sce.trustAsHtml(response.data.html + response.data.confirmationHtml);
      }

      validationBlocks = getValidationBlocks();
    } else if ($window.$) {
      vm.$scope.formHTML = response.data.html;
    } else {
      vm.$scope.formHTML = $sce.trustAsHtml(response.data.html);
    }


  }

  function _cleanup() {
    $element.off('submit', _submit);
  }

  function _submit() {
    if (vm.loadFromAPI) {
      clearAllValidationBlocks();
    }

    // We gather input data manually to account for both
    // load-from-api being true and false
    inputs = getInputElements();

    // We also parse it manually to ensure it matches the GF requirements
    vm.formData = lnOGravityFormDataParser.parse(inputs);
    vm.submitDisabled = true;

    lnOGravityFormService
      .submit(vm.id, vm.formData)
      .then(_onSubmitted, _onError);
  }

  function _onSubmitted(response) {
    vm.submitDisabled = false;

    if (vm.loadFromAPI) {
      vm.formSubmitted = true;
    }

    // manually set cookies because they are not being set by angular $http service
    var confirmationMsg = response.data.response.confirmation_message;

    if ( confirmationMsg && confirmationMsg.trim() !== '' ) {
      var pattern = /<!--cookies:.*-->/;
      var cookies = pattern.exec( confirmationMsg );

      if ( cookies && cookies.length > 0 ) {
        response.data.response.confirmation_message = confirmationMsg.replace( pattern, '' );
        cookies = cookies[0].replace( '<!--cookies:', '' ).replace( '-->', '' );
        cookies = angular.fromJson(cookies);

        angular.forEach(cookies, function(cookie) {
          var splitted = cookie.split( / |=|;/ );

          if ( splitted.length > 2 ) {
            var key = splitted[1];
            var val = decodeURI(splitted[2]);
            var domain = '.' + $location.host();

            $cookies.put( key, val, {
              domain: domain
            } );
          }
        });
      }
    }

    clearInputElements();

    if ($attrs.lnSubmit) {
      vm.onSubmit({response: response});
    }
  }

  function _onError(error) {
    $log.error('lnOGravityFormController._onError()->', error);
    vm.submitDisabled = false;

    if (vm.loadFromAPI) {
      applyValidationErrorMessages(error.data.response.validation_messages);
    }

    if ($attrs.lnError) {
      vm.onError({error: error});
    }
  }

  // Utilities
  //

  function getInputElements() {
    var _elements = [];

    for (var i = 0; i < FORM_INPUTS.length; i++) {
      var _inputs = $element.find(FORM_INPUTS[i]);

      if (!_inputs || !_inputs.length) {
        continue;
      }

      for (var j = 0; j < _inputs.length; j++) {
        _elements.push(_inputs[j]);
      }
    }

    return _elements;
  }

  function clearInputElements() {
    angular.forEach(inputs, function (val) {
      val.value = '';
    });
  }

  function getValidationBlocks() {
    return $element[0].getElementsByClassName('validation-block');
  }

  function clearAllValidationBlocks() {
    if (angular.isDefined(validationBlocks)) {
      angular.element(validationBlocks).find('p').detach();
    }
  }

  function getValidationBlockByInputNumber(value) {
    if (angular.isDefined(validationBlocks)) {
      for (var i = 0; i < validationBlocks.length; i++) {
        var block = validationBlocks[i];

        if (block.attributes.input.value === value) {
          return angular.element(block);
        }
      }
    }
  }

  function applyValidationErrorMessages(validationMessages) {
    for (var i in validationMessages) {
      var block = getValidationBlockByInputNumber(i);

      if (angular.isDefined(block)) {
        var _message = lnOGravityValidationParser.parse(validationMessages[i]);
        block.children('p').detach();
        block.append(_message);
      }
    }

  }

}
