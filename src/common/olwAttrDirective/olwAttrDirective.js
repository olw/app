angular.module('olwAttrDirective', [
    'ng'
])

.directive('olwAttr', function() {
	return function(scope, element, attrs) {
		attrs.$observe('olwAttr', function(at) {
			var attr = scope.$eval(at);
			for (var key in attr) {
				if (attr.hasOwnProperty(key) && attr[key]) {
					element.attr(key, key);
				}
			}
		});
	};
});