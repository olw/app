angular.module('olwMetaService', ['olwConfigurationService', 'pascalprecht.translate', 'ng'])

.factory('meta', ['conf', '$filter', function(conf, $filter) {
    var defaults = {
            description: $filter('translate')('PAGE_DESCRIPTION'),
            logo: 'assets/img/logo/olw.svg',
            title: $filter('translate')('PAGE_TITLE'),
            twitter: conf.app.twitter
        },
        // make meta a copy of defaults
        meta = angular.fromJson(angular.toJson(defaults));
    
    return {
        description: function(description) {
            if (description !== undefined) {
                meta.description = description || defaults.description;
            }
            return meta.description;
        },
        logo: function(logo) {
            if (logo !== undefined) {
                meta.logo = logo || defaults.logo;
            }
            return meta.logo;
        },
        title: function(title) {
            if (title !== undefined) {
                meta.title = title || defaults.title;
            }
            return meta.title;
        },
        twitter: function(twitter) {
            if (twitter !== undefined) {
                meta.twitter = twitter || defaults.twitter;
            }
            return meta.twitter;
        }
    };
}]);