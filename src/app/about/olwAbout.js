angular.module('olwAbout', [
    'olwConfigurationService'
  , 'olwBrandDirective'
  , 'olwMetaService'
  , 'pascalprecht.translate'
  , 'ngRoute'
  , 'ng'
  , 'seo'
])

.config(function($routeProvider) {
	$routeProvider.when('/about', {
		controller: 'AboutCtrl',
		templateUrl: 'about/about.tpl.html'
	});
})

.controller('AboutCtrl', function($scope, $http, $translate, conf, meta) {
	$translate('HEADLINE_ABOUT').then(function(title) {
        $scope.title = title;
        meta.title($scope.title);
    });
	$scope.$parent.slug = 'gw';
    
    $scope.nrs = {};

	$http.jsonp(conf.urls.api + '/resource?callback=JSON_CALLBACK').success(function(result) {
		$scope.nrs.nrResources = result.totalElements;
        $scope.htmlReady();
	});
	$http.jsonp(conf.urls.api + '/area?callback=JSON_CALLBACK').success(function(result) {
		$scope.nrs.nrAreas = result.totalElements;
	});
});