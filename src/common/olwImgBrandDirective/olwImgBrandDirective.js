angular.module('olwImgBrandDirective', ['olwConfigurationService', 'ng'])

.directive('olwImgBrand', ['conf', function(conf) {
	return {
		compile: function(elem, attrs) {
			if (!attrs.url) { attrs.url = conf.urls.host; }
			if (!attrs.alt) { attrs.alt = conf.app.host.title; }
			if (!attrs.logo) { attrs.logo = conf.app.host.logo; }
		},
		restrict: 'A',
		scope: {
			alt: '@',
			logo: '@',
			url: '@'
		},
		templateUrl: 'olwImgBrandDirective/olw-img-brand.tpl.html'
	};
}]);