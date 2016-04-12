var lnAA = {
    templateUrl: 'lnPatterns/atoms/a/template.html',
    bindings: {
        link: '@',
        href: '@',
        target: '@',
        class: '@'
    }
};

angular
    .module('lnPatterns')
    .component('lnAA', lnAA);