angular.module('olwJumbotronDirective', ['ng'])

.directive('olwJumbotron', [function() {
	return {
		replace: true,
		transclude: true,
		restrict: 'A',
		templateUrl: 'olwJumbotronDirective/olw-jumbotron.tpl.html'
	};
}]);