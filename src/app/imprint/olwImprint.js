angular.module( 'olwImprint', ['ngRoute', 'pascalprecht.translate', 'ng', 'seo'])

.config(function($routeProvider) {
	return $routeProvider.when('/imprint', {
		controller: 'ImprintCtrl',
		templateUrl: 'imprint/imprint.tpl.html'
	});
})

.controller('ImprintCtrl', ['$scope', '$filter', function($scope, $filter) {
	$scope.$parent.title = $filter('translate')('PAGE_IMPRINT');
	$scope.$parent.slug = 'gw';
	$scope.htmlReady();
}]);
