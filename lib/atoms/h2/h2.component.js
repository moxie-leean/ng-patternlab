var lnAH2 = {
    templateUrl: 'lnPatterns/atoms/h2/template.html',
    bindings: {
        title: '@',
        class: '@'
    }
};

angular
    .module('lnPatterns')
    .component('lnAH2', lnAH2);