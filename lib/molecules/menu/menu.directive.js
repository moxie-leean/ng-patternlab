angular
  .module('lnPatterns')
  .directive('lnMMenu', lnMMenu);

lnMMenu.$inject = ['$location'];

function lnMMenu($location) {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/molecules/menu/template.html',
    link: link,
    scope: {
      lnSelParentClass: '@',
      lnSelItemClass: '@',
      lnParentIconClass: '@',
      lnItems: '<'
    }
  };

  function link(scope){
    var urlArray = $location.path().split('/');

    const BASE_PATH = urlArray.length > 1 ? urlArray[1] : null;
    const SEGMENT = urlArray.length > 2 ? urlArray[2] : null;

    //mark current menu
    angular.forEach(scope.lnItems, function mapItems(item){
      // check if current item is active
      if (compareUrl(BASE_PATH, item.link)) {
        item.class = (scope.lnSelParentClass || '');
      } else {
        item.class = '';
      }

      // check if the current menu has children and if one of them is active
      if (item.items) {
        angular.forEach(item.items, function mapSubItems(subItem){
          if (compareUrl(SEGMENT, subItem.link)) {
            subItem.class = (scope.lnSelItemClass || '');
          } else {
            subItem.class = '';
          }
        });
      }
    });
  }

  function compareUrl (url, link) {
    return (url && link && link.indexOf(url) > -1);
  }
}