angular.module('olwLiBodyDirective', [])

.directive('olwLiBody', [function() {
	return {
		replace: true,
		templateUrl: 'olwLiBodyDirective/olw-li-body.tpl.html',
		link: function($scope, element, attrs) {
			$scope.title = $scope.$eval(attrs.title);
			$scope.subtitle = $scope.$eval(attrs.subtitle);
			$scope.badges = $scope.$eval(attrs.badges);
			$scope.url = $scope.$eval(attrs.url);
		}
	};
}]);