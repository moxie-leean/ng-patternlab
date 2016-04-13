var lnAA = {
    templateUrl: 'lnPatterns/atoms/a/template.html',
    bindings: {
        title: '@',
        href: '@',
        target: '@',
        class: '@'
    }
};

angular
    .module('lnPatterns')
    .component('lnAA', lnAA);