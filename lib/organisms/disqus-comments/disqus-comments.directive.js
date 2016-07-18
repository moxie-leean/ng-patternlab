angular
  .module( 'app' )
  .directive( 'mxODisqusComments', mxODisqusComments );

mxODisqusComments.$inject = ['$state'];

function mxODisqusComments( $state ) {
  return {
    restrict: 'A',
    templateUrl: 'lnPatterns/organisms/disqus-comments/template.html',
    link: link,
    scope: {
      mxTitle: '@',
      mxDisqusShortname: '@',
      mxDisqusId: '@',
      mxDisqusTitle: '@'
    }
  };

  function link( scope ) {
    scope.disqusConfig = {
      disqus_shortname: scope.mxDisqusShortname,
      disqus_identifier: scope.mxDisqusId,
      disqus_title: scope.mxDisqusTitle,
      disqus_url: $state.href(
        $state.current.name,
        $state.params,
        {
          absolute: true
        }
      )
    };
  }
}
