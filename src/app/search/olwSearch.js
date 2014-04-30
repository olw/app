angular.module('olwSearch', ['olwConfigurationService', 'olwSectionsService', 'olwUsernameFilter', 'ngRoute', 'ng', 'seo'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/search', {
		controller: 'SearchCtrl',
		templateUrl: 'search/search.tpl.html'
	});
}])

.controller('SearchCtrl', ['$scope', '$http', '$routeParams','$location', '$filter', 'conf', 'sections', function($scope, $http, $routeParams, $location, $filter, conf, sections) {
	$scope.page = 0;
	$scope.query = $location.search().query;
	$scope.$parent.title = 'Suchergebnisse';
	$scope.$parent.slug = 'grey';
	$scope.$parent.showMobileSearch = false;
	
	$scope.filter = { language : { german : { id : 1, enabled : true}, english : {id : 2, enabled : true} } };
	$scope.isEnabled = function(filter, prop) { return $scope.filter[filter][prop].enabled; };
	$scope.toggleFilter = function(filter, prop) {
		$scope.filter[filter][prop].enabled = !$scope.filter[filter][prop].enabled;
		
		var eachDisabled = true;
		
		if(!$scope.filter[filter][prop].enabled) {
			for(var p1 in $scope.filter[filter]) {
				if($scope.filter[filter][p1].enabled) {
					eachDisabled = false;
					break;
				}
			}
		} else {
			eachDisabled = false;
		}
		
		if(eachDisabled) {
			for(var p2 in $scope.filter[filter]) {
				if(prop !== p2) {
					$scope.filter[filter][p2].enabled = true;
				}
			}
		}
		
		$scope.fetch($scope.amount, true);
		
		
	};
	
	$scope.amount = 10;
	$scope.page = 0;
	$scope.collections = [];
	$scope.moreAvailable = true;
	$scope.getSlugFor = sections.getSlugForArea;
	
	var filterByLanguage = function() {
		var filterByLanguage = [];
		for(var l in $scope.filter.language) {
			if($scope.filter.language[l].enabled) {
				filterByLanguage.push('language='+$scope.filter.language[l].id);
			}
		}
		filterByLanguage = filterByLanguage.join('&');
		
		return filterByLanguage;
	};
	
	$scope.fetch = function(amount, update) {
		if (!amount) { amount = $scope.amount; }
		if (update) { $scope.page = 0; $scope.collections = [];	}
		
		$http.jsonp(conf.urls.api + '/collection-overview/filter/' + conf.urls.apiIndexPathElement + '?&elements=' + amount + '&' + filterByLanguage() + '&query=' + $scope.query + '&page=' + ($scope.page++) +  '&callback=JSON_CALLBACK').success(function(result) {
			
			$scope.totalElements = result.totalElements;
			$scope.moreAvailable = result.totalElements > amount * $scope.page;
			
			angular.forEach(result.elements, function(collection) {
				$scope.collections.push({ 
						url: sections.getPathElement(collection.name, collection.id),
						title: collection.name,
						users: collection.users.map($filter('username')),
						areas: collection.areas,
						numberOfResources : collection.uuids.length
				});
			});
			
		});
	};
	$scope.fetch(10, true);

	$scope.badges = function(collection) {
		return collection.areas.map(function(area) {
			return {
				title: $filter('translate')('AREA_' + area.id),
				classes: 'badge-' + sections.getSlugForArea(area.name)
			};
		});
	};
	
	$scope.$on('$locationChangeStart', function(event, next) {
		if (next.indexOf('collection') > -1) {
			$scope.$parent.animation = 'to-right';
		} else {
			$scope.$parent.animation = 'none';
		}
	});
}]);