angular.module('olwConfigurationService', ['ng'])

.factory('conf', [function() {
    return {
        app: {
            title: 'OpenLearnWare',
            twitter: '@openlearnware',
            host: {
                title: 'Technische Universität Darmstadt',
                logo: 'assets/img/proprietary/logo/tu.svg'
            }
        },
        urls: {
            api: 'https://openlearnware.tu-darmstadt.de/olw-rest-db/api',
            apiIndexPathElement: 'index/',
            cdn: 'https://olw-material.hrz.tu-darmstadt.de/olw-konv-repository/material',
            host: 'http://www.tu-darmstadt.de/',
            services: 'https://testolw.hrz.tu-darmstadt.de/services'
        }
    };
}]);