angular.module('olwCollection', ['ngRoute', 'ngAnimate', 'olwConfService', 'ng', 'seo'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/collection/:nameWithId', {
		controller: 'CollectionCtrl',
		templateUrl: 'collection/collection.tpl.html'
	});
}])

.controller('CollectionCtrl', ['$scope', '$http', '$routeParams', '$filter', 'olwConf', function($scope, $http, $routeParams, $filter, olwConf) {
	var id = $routeParams.nameWithId.substring($routeParams.nameWithId.lastIndexOf('-')+1);
	$scope.$parent.title = 'Sammlung';
	
	$scope.resources = [];
	$scope.addResource = function(raw, id) {
		var resource = raw[id], history;
		if (resource.open) {
			history = JSON.parse(localStorage.getItem(id));
			$scope.resources.push({
				title: resource.name,
				users: resource.users.map(olwConf.transformUser),
				url: olwConf.urlFor(resource.name, id),
				watched: ((history) ? Math.round(100 * history.current / history.duration) : 0)
			});
		}
	};
	
	$http
		.jsonp(olwConf.api + '/collection-detailview/' + olwConf.index + id + '?callback=JSON_CALLBACK')
		.success(function(result) {
			var slug;
			
			$scope.$parent.title = $scope.title = result.name;
			$scope.description = result.description;
			
			if (result.areas !== undefined && result.areas.length > 0) {
				$scope.area = {
					translation: $filter('translate')('AREA_' + result.areas[0].id),
					title: result.areas[0].name,
					url: olwConf.urlFor(result.areas[0].name, result.areas[0].id)
				};
				$scope.$parent.slug = $scope.slug = olwConf.slug($scope.area.title);
			}
			
			
			$scope.users = result.users.map(olwConf.transformUser);
			$scope.terms = result.semesters.map(function(term) { 
				return { year : term.year, part : term.part }; 
			});
			
			result.collectionElements.filter(function(e) { return !e.hasParent; }).forEach(function(element) {
				if (result.rubrics[element] !== undefined) {
					result.rubrics[element].resources.forEach(function(resource) {
						$scope.addResource(result.resources, resource);
					});
				} else {
					$scope.addResource(result.resources, element);
				}
			});
			
			$scope.htmlReady();
		});

	$scope.$on('$locationChangeStart', function(event, next) {
		if (next.indexOf('area') > -1) {
			$scope.$parent.animation = 'to-left';
		} else if (next.indexOf('resource') > -1) {
			$scope.$parent.animation = 'to-right';
		} else {
			$scope.$parent.animation = 'none';
		}
	});
}]);