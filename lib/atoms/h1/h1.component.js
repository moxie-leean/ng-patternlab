var lnAH1 = {
    templateUrl: 'lnPatterns/atoms/h1/template.html',
    bindings: {
        lnTitle: '@',
        lnClass: '@'
    }
};

angular
    .module('lnPatterns')
    .component('lnAH1', lnAH1);