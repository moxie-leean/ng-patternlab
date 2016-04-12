angular
    .module('lnPatterns')
    .controller('lnGravityFormController', lnGravityFormController);


lnGravityFormController.$inject = ['lnGravityFormService'];


/* @ngInject */
function lnGravityFormController($log, lnGravityFormService) {
    $log.debug('lnGravityFormController');
    var vm = this;
}

