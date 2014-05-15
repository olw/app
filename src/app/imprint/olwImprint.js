angular.module('olwImprint', [
    'olwMetaService'
  , 'ngRoute'
  , 'pascalprecht.translate'
  , 'ng'
  , 'seo'
])

.config(function($routeProvider) {
	return $routeProvider.when('/imprint', {
		controller: 'ImprintCtrl',
		templateUrl: 'imprint/imprint.tpl.html'
	});
})

.controller('ImprintCtrl', function($scope, $translate, meta) {
    $translate('PAGE_IMPRINT').then(function(title) {
        meta.title(title);
        $scope.htmlReady();
    });
    meta.description(false);
	$scope.$parent.slug = 'gw';
});
