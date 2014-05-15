angular.module('olwSection', [
    'olwConfigurationService'
  , 'olwSectionsService'
  , 'olwUsernameFilter'
  , 'olwLiDirective'
  , 'olwLiBodyDirective'
  , 'olwMetaService'
  , 'pascalprecht.translate'
  , 'seo'
  , 'ngRoute'
  , 'ng'
])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/section/:nameWithSlug', {
		controller: 'SectionCtrl',
		templateUrl: 'section/section.tpl.html'
	});
}])

.controller('SectionCtrl', function($scope, $http, $routeParams, $timeout, $filter, $translate, conf, sections, meta) {
	$scope.$parent.slug = $scope.slug = $routeParams.nameWithSlug.substring($routeParams.nameWithSlug.lastIndexOf('-') + 1);
	$translate('SECTION_' + $scope.slug).then(function(title) {
        $scope.title = title;
        meta.title($scope.title);
    });
    meta.description(false);
	
	$scope.filter = { language : { german : { id : 1, enabled : true}, english : {id : 2, enabled : true} } };
	$scope.isEnabled = function(filter, prop) { return $scope.filter[filter][prop].enabled; };
	$scope.toggleFilter = function(filter, prop) {
		var p1
          , p2
          , eachDisabled = true;
        
		$scope.filter[filter][prop].enabled = !$scope.filter[filter][prop].enabled;
		
		if (!$scope.filter[filter][prop].enabled) {
			for(p1 in $scope.filter[filter]) {
				if($scope.filter[filter].hasOwnProperty(p1) && $scope.filter[filter][p1].enabled) {
					eachDisabled = false;
					break;
				}
			}
		} else {
			eachDisabled = false;
		}
		
		if (eachDisabled) {
			for (p2 in $scope.filter[filter]) {
				if ($scope.filter[filter].hasOwnProperty(p2) && prop !== p2) {
					$scope.filter[filter][p2].enabled = true;
				}
			}
		}
		
		$scope.fetch($scope.amount, true);
	};
	
	$scope.amount = 10;
	$scope.page = 0;
	
	$scope.collections = [];
	$scope.highlights = [];
	
	$scope.moreAvailable = true;
	$scope.getSlugFor = sections.getSlugForArea;
	
	// Randomgenerator used for random Highlights - returns random integer value of intervall [0,x]
	var rh = function(x) { return Math.round(Math.random() * x);}
	    // Prepare area ids for query - ?area=1&area=2
	  , filterByArea = sections.sections[$scope.slug].content.map(function(a) { return "area=" + a.id; } ).join('&')
	  , filterByLanguage = function() {
		var lang
          , filterByLanguage = [];
          
		for (lang in $scope.filter.language) {
			if ($scope.filter.language.hasOwnProperty(lang) && $scope.filter.language[lang].enabled) {
				filterByLanguage.push('language='+$scope.filter.language[lang].id);
			}
		}
		filterByLanguage = filterByLanguage.join('&');
		
		return filterByLanguage;
	};

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
	
	$scope.fetch = function(amount, update) {
		if (!amount) { amount = $scope.amount; }
		if (update) { $scope.page = 0; $scope.collections = [];	$scope.highlights = []; }
		
		$http
			.jsonp(conf.urls.api + '/collection-overview/filter/' + conf.urls.apiIndexPathElement +'?&elements=' + amount + '&' + filterByLanguage() + '&page=' + ($scope.page++) + '&' + filterByArea + '&callback=JSON_CALLBACK')
			.success(function(result) {
                var pot
                  , i
                  , r;
                
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
				
				if(update) {
					// make copy of $scope.collections
					pot = $scope.collections.slice();
					// Take/draw randomly 3 collections as highlights 
					for(i = 0; i < Math.min(3, pot.length); i++) {
						r = rh(pot.length - 1);
						$scope.highlights.push(pot[r]);
						pot.splice(r, 1);
					}
				}
			});
	};
	$scope.fetch(10, true);
	
	$scope.$on('$locationChangeStart', function(event, next) {
		if (next.indexOf('collection') > -1) {
			$scope.$parent.animation = 'to-right';
		} else {
			$scope.$parent.animation = 'none';
		}
	});
});


