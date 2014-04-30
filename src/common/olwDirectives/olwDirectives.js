angular.module('olwDirectives', [])

.directive('olwLi', [function() {
	return {
		replace: true,
		templateUrl: 'olwDirectives/olw-li.tpl.html'
	};
}])

.directive('olwJumbotron', [function() {
	return {
		replace: true,
		transclude: true,
		restrict: 'A',
		templateUrl: 'olwDirectives/olw-jumbotron.tpl.html'
	};
}])

.directive('olwBrand', [function() {
	return {
		replace: true,
		restrict: 'E',
		template: '<span style="font-weight:400">Open<span style="font-weight:600">Learn</span>Ware</span>'
	};
}])

.directive('olwImgBrand', [function() {
	return {
		compile: function(elem, attrs) {
			if (!attrs.url) { attrs.url = '//www.tu-darmstadt.de'; }
			if (!attrs.alt) { attrs.alt = 'Technische Universität Darmstadt'; }
			if (!attrs.logo) { attrs.logo = 'assets/img/logo/tu.svg'; }
		},
		restrict: 'A',
		scope: {
			alt: '@?',
			logo: '@?',
			url: '@?'
		},
		templateUrl: 'olwDirectives/olw-img-brand.tpl.html'
	};
}])

.directive('olwLiBody', [function() {
	return {
		replace: true,
		templateUrl: 'olwDirectives/olw-li-body.tpl.html',
		link: function($scope, element, attrs) {
			$scope.title = $scope.$eval(attrs.title);
			$scope.subtitle = $scope.$eval(attrs.subtitle);
			$scope.badges = $scope.$eval(attrs.badges);
			$scope.url = $scope.$eval(attrs.url);
		}
	};
}]);