angular.module('olwArea', [
    'olwConfigurationService'
  , 'olwSectionsService'
  , 'olwUsernameFilter'
  , 'pascalprecht.translate'
  , 'ngRoute'
  , 'ng'
  , 'seo'
])

.config(function($routeProvider) {
	$routeProvider.when('/area/:nameWithId', {
		controller: 'AreaCtrl',
		templateUrl: 'area/area.tpl.html'
	});
})

.controller('AreaCtrl', function($scope, $http, $routeParams, $timeout, $filter, $translate, conf, sections, meta) {
	$scope.id = $routeParams.nameWithId.substring($routeParams.nameWithId.lastIndexOf('-') + 1);
	
	$http
		.jsonp(conf.urls.api + '/area/' + $scope.id + '?callback=JSON_CALLBACK')
		.success(function(result) {
            $translate('AREA_' + result.id).then(function(title) {
                $scope.title = title;
                meta.title($scope.title);
            });
            meta.description(false);
			$scope.$parent.slug = $scope.slug = sections.getSlugForArea(result.code || result.name);
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
		
		$http.jsonp(conf.urls.api + '/collection-overview/filter/' + conf.urls.apiIndexPathElement + '?&elements=' + amount + '&' + filterByLanguage() + '&page=' + ($scope.page++) + '&area=' + $scope.id + '&callback=JSON_CALLBACK').success(function(result) {
			
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
            return $translate('AREA_' + area.id).then(function(title) {
                return {
                    title: title,
                    classes: 'badge-' + sections.getSlugForArea(area.name)
                };
            });
		});
	};
	
	$scope.$on('$locationChangeStart', function(event, next) {
		if (next.indexOf('collection') > -1) {
			$scope.$parent.animation = 'to-right';
		} else {
			$scope.$parent.animation = 'none';
		}
	});
});