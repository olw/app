angular.module('olwContact', [
    'ng'
  , 'seo'
])

.config(function($routeProvider) {
	$routeProvider.when('/contact', {
		controller: 'ContactCtrl',
		templateUrl: 'contact/contact.tpl.html'
	});
})

.controller('ContactCtrl', function($scope) {
	$scope.hello = 'Hello World!';
	$scope.$parent.slug = 'gw';

	$scope.htmlReady();
});