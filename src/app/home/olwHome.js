angular.module('olwHome', ['olwConfigurationService', 'olwSectionsService', 'olwUsernameFilter', 'ngRoute', 'ng', 'seo'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'HomeCtrl',
		templateUrl: 'home/home.tpl.html'
	});
}])

.controller('HomeCtrl', ['$scope', '$http', '$filter', 'conf', 'sections', function($scope, $http, $filter, conf, sections) {
	$scope.$parent.title = 'Highlights';
	$scope.$parent.slug = 'gw';
	
	$scope.page = 0;
	$scope.orderedSections = sections.orderedSectionSlugs;
	$scope.sections = {};
	
	$scope.fetch = function(highlightsInEachSection) {
		$http
			.jsonp(conf.urls.api + '/collection-overview/selection?size=10&page=' + ($scope.page++) + '&callback=JSON_CALLBACK')
			.success(function(result) {
				var highlight, needMore = false;
				result.elements
					.filter(function(element) {
						return element.name !== null && element.areas.length > 0;
					})
					.forEach(function(element) {
						highlight = {
							url: sections.getPathElement(element.name, element.id),
							title: element.name,
							users: element.users.map($filter('username')),
							area: element.areas[0].name,
							areaId: element.areas[0].id
						};
						for (var section in sections.sections) {
							if (sections.sections.hasOwnProperty(section)) {
								if (sections.isAreaInSection(section, highlight.area)) {
									if (section in $scope.sections) {
										if ($scope.sections[section].content.length < highlightsInEachSection) {
											$scope.sections[section].content.push(highlight);
										}
									} else {
										$scope.sections[section] = {title: sections.sections[section].title, content: [highlight], url: section};
									}
								}
							}
						}
					});
				// test if at least `highlightsInEachSection` elements are in each section
				for (var sec in sections.sections) {
					if (sections.sections.hasOwnProperty(sec)) {
						if ($scope.sections[sec] === undefined || $scope.sections[sec].content.length < highlightsInEachSection) {
							needMore = true;
						}
					}
				}
				if (needMore) {
					$scope.fetch(highlightsInEachSection);
				}
			});
	};

	$scope.fetch(3);
}]);