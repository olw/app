angular.module('olw', ['templates-app', 'templates-common', 'olwDirectives', 'olwFilters', 'olwHome', 'olwArea', 'olwResource', 'olwSearch', 'olwSection', 'olwCollection', 'olwContact', 'olwImprint', 'olwAbout', 'olwConfService', 'ngRoute', 'ngAnimate', 'hmTouchEvents', 'pascalprecht.translate', 'btford.markdown', 'ng', 'seo'])

.config(['$routeProvider', '$locationProvider', '$sceProvider', '$translateProvider', function($routeProvider, $locationProvider, $sceProvider, $translateProvider) {
	$locationProvider
		.html5Mode(false)
		.hashPrefix('!');
	$sceProvider
		.enabled(false);
	$translateProvider
		.preferredLanguage((navigator.language.indexOf('de') === 0) ? 'de_DE' : 'en_US');
	$translateProvider
		.useStaticFilesLoader({
			prefix: 'assets/languages/',
			suffix: '.json'
		});
	$routeProvider
		.otherwise({
			redirectTo: '/'
		});
}])

.controller('AppCtrl', ['$scope', '$translate', '$http', '$routeParams', '$route', '$location', 'olwConf', '$timeout', function($scope, $translate, $http, $routeParams, $route, $location, olwConf, $timeout) {
	$scope.titleSuffix = ' | ' + olwConf.title;
	$scope.animation = 'none';

	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.$route = $route;
	$scope.currentLocale = 'de_DE';

	$scope.orderedSections = olwConf.orderedSections;
	$scope.sections = {};

	$scope.executeQuery = function() {
		$location
			.path('/search')
			.search({query: $scope.query});
	};

	$scope.switchLanguage = function(locale) {
		$scope.currentLocale = locale;
		$translate.uses(locale);
	};

	$http
		.jsonp(olwConf.api + '/filter-overview/area?callback=JSON_CALLBACK')
		.success(function(result) {
			var i, area, element, sectionSlug;
			for (i = 0; i < result.elements.length; i++) {
				area = result.elements[i];
				element = {
					id: area.id,
					url: olwConf.urlFor(area.name, area.id)
				};
				for (sectionSlug in olwConf.sections) {
					if (olwConf.sections.hasOwnProperty(sectionSlug)) {
						if (olwConf.isIn(sectionSlug, area.name)) {
							if ($scope.sections[sectionSlug] === undefined) {
								$scope.sections[sectionSlug] = {title: olwConf.sections[sectionSlug].title, content: [element], url:sectionSlug};
							} else {
								$scope.sections[sectionSlug].content.push(element);
							}
						}
					}
				}
			}
			$scope.htmlReady();
	});

	$scope.consume = function(event) {
		event.stopPropagation();
		event.preventDefault();
	};

	$scope.$on('$locationChangeSuccess', function() {
		$scope.openNavigation = false;
		window.scrollTo(0,0);
	});
}]);