var lnAH3 = {
    templateUrl: 'lnPatterns/atoms/h3/template.html',
    bindings: {
        title: '@',
        class: '@'
    }
};

angular
    .module('lnPatterns')
    .component('lnAH3', lnAH3);