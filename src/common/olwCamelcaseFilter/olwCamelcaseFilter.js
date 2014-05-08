angular.module('olwCamelcaseFilter', ['olwSafeStringFilter', 'ng'])

.filter('camelcase', ['$filter', function($filter) {
    return function(input) {
        return $filter('safeString')(input)
                    .split(' ')
					.map(function(word) { return word[0].toUpperCase() + word.substr(1); })
					.join('')
					.replace(/[^A-Za-z0-9_\-]/g, '');
    };
}]);