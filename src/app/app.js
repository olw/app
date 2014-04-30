angular.module('olw', ['templates-app', 'templates-common', 'olwDirectives', 'olwFilters', 'olwHome', 'olwArea', 'olwResource', 'olwSearch', 'olwSection', 'olwCollection', 'olwContact', 'olwImprint', 'olwAbout', 'olwConfigurationService', 'olwSectionsService', 'ngRoute', 'ngAnimate', 'hmTouchEvents', 'pascalprecht.translate', 'btford.markdown', 'ng', 'seo'])

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

.controller('AppCtrl', ['$scope', '$translate', '$http', '$routeParams', '$route', '$location', '$timeout', 'conf', 'sections', function($scope, $translate, $http, $routeParams, $route, $location, $timeout, conf, sections) {
	$scope.titleSuffix = ' | ' + conf.app.title;
	$scope.animation = 'none';

	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.$route = $route;
	$scope.currentLocale = 'de_DE';

	$scope.orderedSections = sections.orderedSectionSlugs;
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
		.jsonp(conf.urls.api + '/filter-overview/area?callback=JSON_CALLBACK')
		.success(function(result) {
			var i, area, element, sectionSlug;
			for (i = 0; i < result.elements.length; i++) {
				area = result.elements[i];
				element = {
					id: area.id,
					url: sections.getPathElement(area.name, area.id)
				};
				for (sectionSlug in sections.sections) {
					if (sections.sections.hasOwnProperty(sectionSlug)) {
						if (sections.isAreaInSection(sectionSlug, area.name)) {
							if ($scope.sections[sectionSlug] === undefined) {
								$scope.sections[sectionSlug] = {title: sections.sections[sectionSlug].title, content: [element], url: sectionSlug};
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