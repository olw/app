angular.module('olwCdnService', ['olwConfigurationService', 'olwCamelcaseFilter', 'ng'])

.factory('cdn', ['conf', '$filter', '$http', function(conf, $filter, $http) {
    var cdn = {
        base: conf.urls.cdn,
        getChaptersForUuid: function(uuid, type, next) {
            var url = cdn.getUrlForUuid(uuid), tmp;
            if ([5,6,7,8].indexOf(type) > -1) {
                $http
                    .jsonp(conf.urls.services + '/json?callback=JSON_CALLBACK&from=' + url + '/red5/100.xml')
                    .success(function(result) {
                        if (result.vorlesung.teilen) {
                            try {
                                tmp = result.vorlesung.teilen.teil.length;
                                next(undefined, result.vorlesung.teilen.teil);
                            } catch (err) {
                                next(undefined, [result.vorlesung.teilen.teil]);
                            }
                        } else {
                            next('malformed json file');
                        }
                    })
                    .error(function(result) {
                        next(result);
                    });
            } else {
                next('only resources of type 5..8 (not "' + type + '") are considered to have chapters');
            }
        },
        getDownloadUrlForUuid: function(uuid, type, title) {
            var url = cdn.getUrlForUuid(uuid)
              , filename;

            switch (type) {
                case 1:
                    filename = '13.pdf';
                    break;
                case 2:
                    filename = '2.mp4';
                    break;
                case 3:
                    filename = '7.mp3';
                    break;
                case 4:
                    filename = '1.mp4';
                    break;
                case 5:
                case 6:
                    filename = '4.mp4';
                    break;
                case 7:
                case 8:
                    filename = '90.mp4';
                    break;
                case 9:
                    filename = '30.zip';
                    break;
                case 10:
                    filename = '3.mp4';
                    break;
                default:
                    filename = '7.mp3';
                    break;
            }

            return url + '/' + filename + '?filename=' + $filter('camelcase')(title) + filename.substr(filename.lastIndexOf('.'));
        },
        getNatureOfCharacteristicType: function(type) {
            switch (type) {
                case 1:
                    return 'pdf';
                case 3:
                    return 'audio';
                case 9:
                    return 'raw';
                default:
                    return 'video';
            }
        },
        getSourcesForUuid: function(uuid, type) {
            var url = cdn.getUrlForUuid(uuid)
              , mapper = function(src) { return url + '/' + src; }
              , result;

            switch (type) {
                case 1:
                    result = {
                        pdf: ['13.pdf'].map(mapper)
                    };
                    break;
                case 2:
                    result = {
                        video: ['106.webm', '2.mp4', '4.mp4'].map(mapper),
                        audio: ['8.ogg', '7.mp3'].map(mapper)
                    };
                    break;
                case 3:
                    result = {
                        audio: ['8.ogg', '7.mp3'].map(mapper)
                    };
                    break;
                case 4:
                    result = {
                        video: ['105.webm', '1.mp4', '4.mp4'].map(mapper),
                        audio: ['8.ogg', '7.mp3'].map(mapper)
                    };
                    break;
                case 5:
                case 6:
                    result = {
                        // TODO video and lecturer are switched in so many resources
                        // that they are switched here
                        // switch it back if problem is resolved
                        lecturer: ['105.webm', '1.mp4', '4.mp4'].map(mapper),
                        audio: ['8.ogg', '7.mp3'].map(mapper),
                        video: ['205.webm', '9.mp4', '90.mp4'].map(mapper)
                    };
                    break;
                case 7:
                case 8:
                    result = {
                        audio: ['8.ogg', '7.mp3'].map(mapper),
                        lecturer: ['205.webm', '9.mp4', '90.mp4'].map(mapper)
                    };
                    break;
                case 9:
                    result = {
                        raw: ['30.zip'].map(mapper)
                    };
                    break;
                case 10:
                    result = {
                        video: ['3.mp4', '106.webm', '2.mp4', '4.mp4'].map(mapper),
                        audio: ['8.ogg', '7.mp3'].map(mapper),
                        // lecturer: ['9.mp4', '90.mp4'].map(mapper)
                    };
                    break;
                default:
                    result = false;
                    break;
            }

            return result;
        },
        getUrlForUuid: function(uuid) {
            return [cdn.base].concat(uuid.replace(/-/g, '').match(/.{2}/g)).join('/');
        }
    };
    
    return cdn;
}]);