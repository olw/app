angular.module('olwConfigurationService', ['ng'])

.factory('conf', [function() {
    return {
        app: {
            title: 'OpenLearnWare'  
        },
        urls: {
            api: 'https://openlearnware.tu-darmstadt.de/olw-rest-db/api',
            cdn: 'https://olw-material.hrz.tu-darmstadt.de/olw-konv-repository/material',
            services: 'https://testolw.hrz.tu-darmstadt.de/services'
        }
    };
}]);