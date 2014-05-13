angular.module('olwDasherizeFilter', ['olwSafeStringFilter', 'ng'])

.filter('dasherize', ['$filter', function($filter) {
    return function(input) {
        return $filter('safeString')(input)
                    .replace(/[\s_]/g, '-')
					.replace(/[^A-Za-z0-9_\-]/g, '')
					.replace(/\-+/g, '-');
    };
}]);