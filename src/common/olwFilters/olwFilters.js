angular.module('olwFilters', ['olwTruncateFilter'])

.filter('truncate', ['$filter', function($filter) {
	return $filter('trunc');
}]);