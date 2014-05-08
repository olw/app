angular.module('olwLiDirective', ['ng'])

.directive('olwLi', [function() {
	return {
		replace: true,
		templateUrl: 'olwDirectives/olw-li.tpl.html'
	};
}]);