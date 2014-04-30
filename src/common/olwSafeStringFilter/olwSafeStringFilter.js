angular.module('olwSafeStringFilter', ['ng'])

.filter('safeString', [function() {
    return function(input) {
        return input.toLowerCase()
					.replace(/ä/g, 'a')
					.replace(/ö/g, 'o')
					.replace(/ü/g, 'u')
					.replace(/ß/g, 'ss')
					.replace(/^\s+|\s+$/g, '');
    };
}]);