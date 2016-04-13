var lnAA = {
    templateUrl: 'lnPatterns/atoms/a/template.html',
    bindings: {
        lnTitle: '@',
        lnHref: '@',
        lnTarget: '@',
        lnClass: '@'
    }
};

angular
    .module('lnPatterns')
    .component('lnAA', lnAA);