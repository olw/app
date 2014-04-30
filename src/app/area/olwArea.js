angular.module('olwArea', ['ngRoute', 'olwConfService', 'ng', 'seo'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/area/:nameWithId', {
		controller: 'AreaCtrl',
		templateUrl: 'area/area.tpl.html'
	});
}])

.controller('AreaCtrl', ['$scope', '$http', '$routeParams', 'olwConf', '$timeout', '$filter', function($scope, $http, $routeParams, olwConf, $timeout, $filter) {
	$scope.id = $routeParams.nameWithId.substring($routeParams.nameWithId.lastIndexOf('-') + 1);
	
	$http
		.jsonp(olwConf.api + '/area/' + $scope.id + '?callback=JSON_CALLBACK')
		.success(function(result) {
			$scope.$parent.title = $scope.title = $filter('translate')('AREA_' + result.id);
			$scope.$parent.slug = $scope.slug = olwConf.slug(result.code || result.name);
		});
	
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
	$scope.getSlugFor = olwConf.slug;
	
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
		
		console.log('index: ' + olwConf.index);
		$http.jsonp(olwConf.api + '/collection-overview/filter/' + olwConf.index + '?&elements=' + amount + '&' + filterByLanguage() + '&page=' + ($scope.page++) + '&area=' + $scope.id + '&callback=JSON_CALLBACK').success(function(result) {
			
			$scope.totalElements = result.totalElements;
			$scope.moreAvailable = result.totalElements > amount * $scope.page;
			
			angular.forEach(result.elements, function(collection) {
				$scope.collections.push({ 
						url: olwConf.urlFor(collection.name, collection.id),
						title: collection.name,
						users: collection.users.map(olwConf.transformUser),
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
				classes: 'badge-' + $scope.getSlugFor(area.name)
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