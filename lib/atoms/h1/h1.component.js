var lnAH1 = {
    restrict: 'E',
    replace: true,
    templateUrl: 'lnPatterns/atoms/h1/template.html',
    bindings: {
        title: '<',
        class: '<'
    }
};

angular
    .module('lnPatterns')
    .component('lnAH1', lnAH1);

