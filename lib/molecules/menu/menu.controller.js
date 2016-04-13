function lnMMenuController($location) {
    var ctrl = this;

    ctrl.compareUrl = function(url, link) {
        return (url && link && link.indexOf(url) > -1);
    };

    ctrl.markCurrentMenu = function() {
        var urlArray = $location.path().split('/');

        const BASE_PATH = urlArray.length > 1 ? urlArray[1] : null;
        const SEGMENT = urlArray.length > 2 ? urlArray[2] : null;

        angular.forEach(ctrl.lnItems, function(item){
            // check if current item is active
            if (ctrl.compareUrl(BASE_PATH, item.link))
                item.class = (ctrl.lnSelParentClass || '');
            else
                item.class = '';

            // check if the current menu has children and if one of them is active
            if (item.items) {
                angular.forEach(item.items, function(subItem){
                    if (ctrl.compareUrl(SEGMENT, subItem.link))
                        subItem.class = (ctrl.lnSelItemClass || '');
                    else
                        subItem.class = '';
                });
            }
        });
    };

    ctrl.markCurrentMenu();
}

lnMMenuController.$inject = ['$location'];

angular
    .module('lnPatterns')
    .controller('lnMMenuController', lnMMenuController);