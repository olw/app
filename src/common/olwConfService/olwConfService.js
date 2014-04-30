angular.module('olwConfService', ['olwConfigurationService', 'olwSafeStringFilter', 'olwDasherizeFilter', 'olwCamelcaseFilter', 'olwUsernameFilter', 'olwCdnService', 'olwSectionsService'])

.factory('olwConf', ['$http', '$filter', 'conf', 'cdn', 'sections', function($http, $filter, c, cdn, sections) {
	var conf = {
		api : c.urls.api,
		index : c.urls.apiIndexPathElement,
		cdn: cdn.base,
		services: c.urls.services,
		safeString: $filter('safeString'),
		dasherize: $filter('dasherize'),
		camelcase: $filter('camelcase'),
		downloadUrl: cdn.getDownloadUrlForUuid,
		sections: sections.sections,
		orderedSections: sections.orderedSectionSlugs,
		resourceMainType: cdn.getNatureOfCharacteristicType,
		fetchChapters: cdn.getChaptersForUuid,
		sources: cdn.getSourcesForUuid,
		isIn: sections.isAreaInSection,
		slug: sections.getSlugForArea,
		title: c.app.title,
		transformUser: $filter('username'),
		urlFor: sections.getPathElement,
		uuidUrl: cdn.getUrlForUuid
	};


	return {
		api: conf.api,
		downloadUrl: conf.downloadUrl,
		index : conf.index,
		fetchChapters: conf.fetchChapters,
		isIn: conf.isIn,
		resourceMainType: conf.resourceMainType,
		orderedSections: conf.orderedSections,
		sections: conf.sections,
		services: conf.services,
		slug: conf.slug,
		sources: conf.sources,
		title: conf.title,
		transformUser: conf.transformUser,
		urlFor: conf.urlFor,
		uuidUrl : conf.uuidUrl
	};
}]);