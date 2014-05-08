angular.module('olwCdnService', ['olwConfigurationService', 'olwCamelcaseFilter', 'ng'])

.factory('cdn', ['conf', '$filter', '$http', '$q', function(conf, $filter, $http, $q) {
    var cdn = {
        base: conf.urls.cdn,
        // returns a promise to get all chapters for the given uuid/type
        getChaptersForUuid: function(uuid, type) {
            var deferred = $q.defer()
              , url = cdn.getUrlForUuid(uuid), tmp;
            if ([5,6,7,8].indexOf(type) > -1) {
                $http
                    .jsonp(conf.urls.services + '/json?callback=JSON_CALLBACK&from=' + url + '/red5/100.xml')
                    .success(function(result) {
                        if (result.vorlesung.teilen) {
                            // if there is only a single chapter then result.vorlesung.teilen.teil is no array of objects but a single object
                            // so we must check if we have an array already or have to create one
                            try {
                                tmp = result.vorlesung.teilen.teil.length;
                                deferred.resolve(result.vorlesung.teilen.teil);
                            } catch (err) {
                                deferred.resolve([result.vorlesung.teilen.teil]);
                            }
                        } else {
                            deferred.reject('malformed json file');
                        }
                    })
                    .error(function(result) {
                        deferred.reject(result);
                    });
            } else {
                deferred.reject('only resources of type 5..8 (not "' + type + '") are considered to have chapters');
            }
			
            return deferred.promise;
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
        // returns a promise to get all available sources for the given uuid
        getSourcesForUuid: function(uuid) {
            var deferred = $q.defer()
              , url = cdn.getUrlForUuid(uuid);

            $q.all(['1.mp4', '2.mp4', '3.mp4', '4.mp4', '7.mp3', '8.ogg', '9.mp4', '13.pdf', '30.zip', '90.mp4', '105.webm', '106.webm', '205.webm'].map(function(filename) {
                var q = $q.defer()
                  , path = url + '/' + filename;
                $http.head(path)
                    .success(function(result) {
                        q.resolve({ name: filename, path: path });
                    })
                    .error(function(result) {
                        q.resolve(false);
                    });
                return q.promise;
            })).then(function(result) {
                var files = result.filter(function(i) { return i; })
                  , onlyPath = function(f) { return f.path; }
                  , sources = {
                        pdf: files.filter(function(file) {
                                return ['13.pdf'].indexOf(file.name) > -1;
                            }).map(onlyPath),
                        audio: files.filter(function(file) {
                                return ['7.mp3', '8.ogg'].indexOf(file.name) > -1;
                            }).map(onlyPath),
                        video: files.filter(function(file) {
                                return ['1.mp4', '2.mp4', '4.mp4', '105.webm', '106.webm'].indexOf(file.name) > -1;
                            }).map(onlyPath),
                        lecturer: files.filter(function(file) {
                                return ['9.mp4', '90.mp4', '205.webm'].indexOf(file.name) > -1;
                            }).map(onlyPath)
                    }
                  , key;

                // for camtasia files that have only one file instead of two
                if (sources.video.length === 0) {
                    sources.video = sources.lecturer;
                    delete sources.lecturer;
                }
                // in video files audio should not be shown at all
                    if (sources.video.length > 0) {
                    delete sources.audio;
                }

                for (key in sources) {
                    if (sources.hasOwnProperty(key) && sources[key].length === 0) {
                        delete sources[key];
                    }
                }

                deferred.resolve(sources);
            });

            return deferred.promise;
        },
        getUrlForUuid: function(uuid) {
            return [cdn.base].concat(uuid.replace(/-/g, '').match(/.{2}/g)).join('/');
        }
    };
    
    return cdn;
}]);

function flatten(array) {
	return [].concat.apply([], array);
}