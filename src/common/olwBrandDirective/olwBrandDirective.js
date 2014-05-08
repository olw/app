angular.module('olwBrandDirective', ['ng'])

.directive('olwBrand', [function() {
	return {
		replace: true,
		restrict: 'E',
		template: '<span style="font-weight:400">Open<span style="font-weight:600">Learn</span>Ware</span>'
	};
}]);