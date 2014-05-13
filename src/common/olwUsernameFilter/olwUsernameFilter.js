angular.module('olwUsernameFilter', ['ng'])

.filter('username', function() {
    return function(input) {
        return [input.title, input.firstName, input.lastName].join(' ');
    };
});