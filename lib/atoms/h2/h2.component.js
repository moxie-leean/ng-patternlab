angular
    .module('lnPatterns')
    .component('lnAH2', lnAH2);

var lnAH2 = {
    restrict: 'E',
    replace: true,
    templateUrl: 'lnPatterns/atoms/h2/template.html',
    bindings: {
        title: '<',
        class: '<'
    }
};

