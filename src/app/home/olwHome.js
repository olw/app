angular.module('olwHome', ['ngRoute', 'olwConfService', 'olwFilters', 'ng', 'seo'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
		controller: 'HomeCtrl',
		templateUrl: 'home/home.tpl.html'
	});
}])

.controller('HomeCtrl', ['$scope', '$http', 'olwConf', function($scope, $http, olwConf) {
	$scope.$parent.title = 'Highlights';
	$scope.$parent.slug = 'gw';
	
	$scope.page = 0;
	$scope.orderedSections = olwConf.orderedSections;
	$scope.sections = {};
	
	$scope.fetch = function(highlightsInEachSection) {
		$http
			.jsonp(olwConf.api + '/collection-overview/selection?size=10&page=' + ($scope.page++) + '&callback=JSON_CALLBACK')
			.success(function(result) {
				var highlight, needMore = false;
				result.elements
					.filter(function(element) {
						return element.name !== null && element.areas.length > 0;
					})
					.forEach(function(element) {
						highlight = {
							url: olwConf.urlFor(element.name, element.id),
							title: element.name,
							users: element.users.map(olwConf.transformUser),
							area: element.areas[0].name,
							areaId: element.areas[0].id
						};
						for (var section in olwConf.sections) {
							if (olwConf.sections.hasOwnProperty(section)) {
								if (olwConf.isIn(section, highlight.area)) {
									if (section in $scope.sections) {
										if ($scope.sections[section].content.length < highlightsInEachSection) {
											$scope.sections[section].content.push(highlight);
										}
									} else {
										$scope.sections[section] = {title: olwConf.sections[section].title, content: [highlight], url: section};
									}
								}
							}
						}
					});
				// test if at least `highlightsInEachSection` elements are in each section
				for (var sec in olwConf.sections) {
					if (olwConf.sections.hasOwnProperty(sec)) {
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