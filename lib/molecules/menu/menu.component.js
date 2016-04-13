var lnMMenu = {
    templateUrl: 'lnPatterns/molecules/menu/template.html',
    controller: 'lnMMenuController',
    bindings: {
        lnClass: '@',
        lnSelParentClass: '@',
        lnSelItemClass: '@',
        lnParentIconClass: '@',
        lnItems: '<'
    }
};

angular
    .module('lnPatterns')
    .component('lnMMenu', lnMMenu);