angular.module('olwTruncateFilter', ['ng'])

.filter('trunc', [function() {
    return function (input, max, tail) {
		if (!input) { return ''; }

		max = parseInt(max, 10);
		if (!max) { return input; }
		if (input.length <= max) { return input; }

		input = input.substr(0, max);
		return input + (tail || ' …');
	};
}]);