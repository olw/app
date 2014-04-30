angular.module('olwConfService', [])

.factory('olwConf', ['$http', function($http) {
	var conf = {
		// api : 'https://testolw.hrz.tu-darmstadt.de/olw-rest-db/api',
		api : 'https://openlearnware.tu-darmstadt.de/olw-rest-db/api',
		index : 'index/',
		cdn: 'https://olw-material.hrz.tu-darmstadt.de/olw-konv-repository/material',
		services: 'https://testolw.hrz.tu-darmstadt.de/services',
		safeString: function(str) {
			return str
					.toLowerCase()
					.replace(/ä/g, 'a')
					.replace(/ö/g, 'o')
					.replace(/ü/g, 'u')
					.replace(/ß/g, 'ss')
					.replace(/^\s+|\s+$/g, '');
		},
		dasherize: function(str) {
			return conf.safeString(str)
					.replace(/[\s_]/g, '-')
					.replace(/[^A-Za-z0-9_\-]/g, '')
					.replace(/\-+/g, '-');
		},
		camelcase: function(str) {
			return conf.safeString(str)
					.split(' ')
					.map(function(word) { return word[0].toUpperCase() + word.substr(1); })
					.join('')
					.replace(/[^A-Za-z0-9_\-]/g, '');
		},
		downloadUrl: function(uuid, type, title) {
			var url = conf.uuidUrl(uuid)
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

			return url + '/' + filename + '?filename=' + conf.camelcase(title) + filename.substr(filename.lastIndexOf('.'));
		},
		sections: {
			iw: { 
				title: 'Ingenieurswissenschaften',
				content: [
					{title: 'Architektur', id: 9}, 
					{title: 'Arbeitswissenschaften', id: 11},
					{title:'Bauingenieurwesen', id: 2},
					{title:'Informatik', id: 4},
					{title: 'Maschinenbau', id: 1}
					// {title: 'Elektrotechnik', id: }
				]
			},
			nw: { 
				title: 'Naturwissenschaften',
				content: [
					{title: 'Mathematik', id: 5},
					{title: 'Physik', id: 6}
					// {title: 'Biologie', id: },
					// {title: 'Chemie', id: },
					// {title: 'Material- und Geowissenschaften', id: }
				]
			},
			gw: { 
				title: 'Geistes- und Sozialwissenschaften',
				content: [
					{title: 'Philosophie', id: 7},
					// {title: 'Politikwissenschaften', id: 3},
					{title: 'Pädagogik', id: 13},
					// {title: 'Wirtschaft', id: },
					// {title: 'Rechtswissenschaften', id: },
					// {title: 'Soziologie', id: },
					// {title: 'Sprach- und Literaturwissenschaften', id: },
					// {title: 'Theologie und Sozialethik', id: },
					// {title: 'Sportwissenschaften', id: 10},
					{title: 'E-Learning', id: 8},
					{title: 'Politikwissenschaft', id: 3},
					{title: 'Rechts- und Wirtschaftswissenschaften', id: 12},
					{title: 'Sportwissenschaft', id: 10}
				]
			}
		},
		orderedSections: ['iw', 'nw', 'gw'],
		resourceMainType: function(type) {
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
		fetchChapters: function(uuid, type, callback) {
			var url = conf.uuidUrl(uuid), tmp;
			if ([5,6,7,8].indexOf(type) > -1) {
				$http
					.jsonp(conf.services + '/json?callback=JSON_CALLBACK&from=' + url + '/red5/100.xml')
					.success(function(result) {
						if (result.vorlesung.teilen) {
							try {
								tmp = result.vorlesung.teilen.teil.length;
								callback(undefined, result.vorlesung.teilen.teil);
							} catch (err) {
								callback(undefined, [result.vorlesung.teilen.teil]);
							}
						} else {
							callback(false);
						}
					})
					.error(function(result) {
						callback(false);
					});
			} else {
				callback(false);
			}
		},
		sources: function(uuid, type) {
			var url = conf.uuidUrl(uuid)
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
			}

			return result;
		},
		isIn: function(sectionSlug, areaTitle) {
			try {
				for (var i = 0; i < conf.sections[sectionSlug].content.length; i++) {
					if (conf.sections[sectionSlug].content[i].title == areaTitle) {
						return true;
					}
				}
				return false;
			} catch (exception) {
				return false;
			}
		},
		slug: function(area) {
			for (var slug in conf.sections) {
				if (conf.sections.hasOwnProperty(slug)) {
					if (conf.isIn(slug, area)) {
						return slug;
					}
				}
			}
		},
		title: 'OpenLearnWare',
		transformUser: function(user) {
			return user.title + ' ' + user.firstName + ' ' + user.lastName;
		},
		urlFor: function(title, id) {
			return [conf.dasherize(title), id].join('-');
		},
		uuidUrl: function(uuid) {
			return [conf.cdn].concat(uuid.replace( /-/g, '' ).match( /.{2}/g )).join( '/' );
		}
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