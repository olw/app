angular.module('olwAbout', ['olwConfService', 'ngRoute', 'pascalprecht.translate', 'ng', 'seo']) //, 'btford.markdown'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/about', {
		controller: 'AboutCtrl',
		templateUrl: 'about/about.tpl.html'
	});
}])

.controller('AboutCtrl', ['$scope', '$http', '$filter', 'olwConf', function($scope, $http, $filter, olwConf) {
	$scope.$parent.title = $scope.title = $filter('translate')('HEADLINE_ABOUT');
	$scope.$parent.slug = 'gw';

	$http.jsonp(olwConf.api + '/resource?callback=JSON_CALLBACK').success(function(result) {
		$scope.nrResources = result.totalElements;
	});
	$http.jsonp(olwConf.api + '/area?callback=JSON_CALLBACK').success(function(result) {
		$scope.nrAreas = result.totalElements;
	});
	
	// $scope.loadAboutPage = function(locale) {
	// 	$http
	// 		.get(olwConf.services + '/md/about-' + locale + '.md')
	// 		.success(function(result) {
	// 			$scope.md = result;
	// 			$scope.htmlReady();
	// 		});
	// };

	// $scope.$on('$translateChangeSuccess', function() {
	// 	$scope.loadAboutPage($scope.$parent.currentLocale);
	// });
}]);