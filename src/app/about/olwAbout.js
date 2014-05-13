angular.module('olwAbout', ['olwConfigurationService', 'ngRoute', 'pascalprecht.translate', 'ng', 'seo']) //, 'btford.markdown'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/about', {
		controller: 'AboutCtrl',
		templateUrl: 'about/about.tpl.html'
	});
}])

.controller('AboutCtrl', ['$scope', '$http', '$filter', 'conf', function($scope, $http, $filter, conf) {
	$scope.$parent.title = $scope.title = $filter('translate')('HEADLINE_ABOUT');
	$scope.$parent.slug = 'gw';

	$http.jsonp(conf.urls.api + '/resource?callback=JSON_CALLBACK').success(function(result) {
		$scope.nrResources = result.totalElements;
        $scope.htmlReady();
	});
	$http.jsonp(conf.urls.api + '/area?callback=JSON_CALLBACK').success(function(result) {
		$scope.nrAreas = result.totalElements;
	});
}]);