angular.module('olwContact', ['ng', 'seo'])

.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/contact', {
		controller: 'ContactCtrl',
		templateUrl: 'contact/contact.tpl.html'
	});
}])

.controller('ContactCtrl', ['$scope', function($scope) {
	$scope.hello = 'Hello World!';
	$scope.$parent.slug = 'gw';

	$scope.htmlReady();
}]);