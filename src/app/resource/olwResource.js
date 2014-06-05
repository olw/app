angular.module('olwResource', [
    'olwMetaService'
  , 'olwConfigurationService'
  , 'olwSectionsService'
  , 'olwCdnService'
  , 'olwUsernameFilter'
  , 'olwAttrDirective'
  , 'ngRoute'
  , 'ngAnimate'
  , 'hmTouchEvents'
  , 'ng'
  , 'seo'
])

.config(function($routeProvider) {
	$routeProvider.when('/resource/:nameWithId', {
		controller: 'ResourceCtrl',
		templateUrl: 'resource/resource.tpl.html'
	});
})	

.controller('ResourceCtrl', function($scope, $http, $routeParams, $timeout, $filter, conf, sections, cdn, meta) {
	var id = $routeParams.nameWithId.substring($routeParams.nameWithId.lastIndexOf('-') + 1)
	  , start = 1;

	if (localStorage.getItem(id)) {
		start = angular.fromJson(localStorage.getItem(id)).current;
	}

	meta.title('Material');
	$scope.media = [];

	$http
		.jsonp(conf.urls.api + '/resource-detailview/' + conf.urls.apiIndexPathElement + id + '?callback=JSON_CALLBACK')
		.success(function(result) {
			var slug;
			$scope.title = result.name;
            meta.title($scope.title);

			$scope.sources = {};
			$scope.users = result.users.map($filter('username'));
			$scope.date = parseInt(result.creationDate, 10);
			$scope.code = result.code.split('-');
			$scope.type = result.characteristicType;
			$scope.related = result.externalResources;
			$scope.description = result.description;
            meta.description($scope.description);
			if (result.areas) {
				$scope.areas = result.areas.map(function(area) { return { title: area.code, url: sections.getPathElement(area.code, area.id) }; });
				$scope.$parent.slug = $scope.slug = sections.getSlugForArea($scope.areas[0].title);
			}
			if (result.semesters) {
				$scope.terms = result.semesters.map(function(term) {
					return { 
                        year: term.year,
                        part: 'SEMESTER_PART_' + term.part
                    }; 
				});
			}
			
			cdn.getSourcesForUuid(result.uuid).then(function(sources) {
				var key, i, best = ['3.mp4', '2.mp4', '106.webm', '1.mp4', '105.webm', '4.mp4'], onlyFilenameSources, bestIndex;

				$scope.sources = sources;
				$scope.canvasShow = cdn.getNatureOfCharacteristicType($scope.type);
				if (result.childs.length > 0) {
					angular.extend($scope.sources, {pdf: [cdn.getUrlForUuid(result.childs[0]) + '/13.pdf']});
				}
				if ($scope.canvasShow === 'pdf' || result.childs.length > 0) {
					$scope.canvasShow = 'pdf';
					jQuery('#pdf').PDFDoc({
						source: $scope.sources.pdf[0],
						page: start
					});
				}

				$scope.downloadUrls = {
					raw: cdn.getUrlForUuid(result.uuid) + '/30.zip'
				};
				$scope.downloadUrls.raw += $scope.filename(result.name, $scope.downloadUrls.raw);

				for (key in sources) {
					if (sources.hasOwnProperty(key)) {
						$scope.downloadUrls[key] = (sources[key]) ? sources[key][0] + $scope.filename(result.name, sources[key][0]) : $scope.downloadUrls.raw;
						if (key === 'video') {
							onlyFilenameSources = sources[key].map(function(s) {
								return s.substring(s.lastIndexOf('/') + 1);
							});
							for (i = 0; i < best.length; i++) {
								bestIndex = onlyFilenameSources.indexOf(best[i]);
								if (bestIndex > -1) {
									$scope.downloadUrls[key] = sources[key][bestIndex] + $scope.filename(result.name, sources[key][bestIndex]);
									break;
								}
							}
							if (!$scope.downloadUrls.video) {
								$scope.downloadUrls.video = (sources.lecturer) ? sources.lecturer[0] + $scope.filename(result.name, sources.lecturer[0]) : $scope.downloadUrls.raw;
							}
						}
					}
				}
				console.log($scope.downloadUrls, $scope.canvasShow);
			});

			$scope.filename = function(name, url) {
				return '?filename=' + $filter('camelcase')(name) + url.substr(url.lastIndexOf('.'));
			};

			//$scope.downloadUrl = cdn.getDownloadUrlForUuid(result.uuid, $scope.type, $scope.title);
			$scope.licenseTranslationParams = {
				title: $scope.title,
				users: $scope.users.join(', ')
			};


			// if tabs (video | pdf | audio) are switched, rebuild the media list
			// to only contain the elements that are currently present
			$scope.$watch('canvasShow', function(now, old) {
				var src, elem;
				$scope.downloadUrl = $scope.downloadUrls[now];
				// remove possible timeupdate listeners
				if ('video' in $scope.sources && 'lecturer' in $scope.sources) {
					document.getElementById('video').removeEventListener('timeupdate', $scope.sync);
				}
				// add all sources to media, pause them
				$scope.media = [];
				for (src in $scope.sources) {
					if ($scope.sources.hasOwnProperty(src) && ['video', 'lecturer', 'audio'].indexOf(src) > -1) {
						elem = document.getElementById(src);
						elem.pause();
						$scope.media.push(elem);
					}
				}
				// sync sources
				if (old == 'audio') {
					$scope.jump(Math.max(0, document.getElementById('audio').currentTime - 7));
				} else if (old == 'video') {
					if ('video' in $scope.sources) {
						$scope.jump(document.getElementById('video').currentTime);
					} else {
						$scope.jump(document.getElementById('lecturer').currentTime);
					}
				}
				// remove irrelevant sources from media
				// (in fact: rebuild media using only relevant sources)
				switch (now) {
					case 'video':
						$scope.media = [];
						for (src in $scope.sources) {
							if ($scope.sources.hasOwnProperty(src) && ['video', 'lecturer'].indexOf(src) > -1) {
								$scope.media.push(document.getElementById(src));
							}
						}
						if ('video' in $scope.sources && 'lecturer' in $scope.sources) {
							document.getElementById('video').addEventListener('timeupdate', $scope.sync);
						}
						break;
					case 'pdf':
						$scope.media = [];
						break;
					case 'audio':
						$scope.media = [document.getElementById('audio')];
						break;
					default:
						break;
				}
			});

			cdn.getChaptersForUuid(result.uuid, $scope.type)
				.then(function(chapters) {
					if (chapters) {
						$scope.chapters = chapters.map(function(chapter) {
							return {
								title: chapter.kapitel,
								from: chapter.startZeit,
								length: chapter.laenge,
								fromRendered: (new Date(new Date(0).setHours(0)).setSeconds(chapter.startZeit)),
								active: false
							};
						});
					}
					$scope.htmlReady();
				});	
			
			if (result.collections) {
                console.log(result.collections);
				$scope.collections = result.collections.map(function(collection) { return { title: collection.name, url: sections.getPathElement(collection.name, collection.id) }; });

				$http.jsonp(conf.urls.api + '/collection-detailview/' + result.collections[0].id + '?callback=JSON_CALLBACK')
					.success(function(result) {
						// find next if id is top level
						angular.forEach(result.collectionElements, function(collectionElement, index) {
							if (collectionElement == id) {
								// i'm top level
								if (index + 1 < result.collectionElements.length) {
									// there are more
									if (result.resources.hasOwnProperty(result.collectionElements[index+1])) {
										// next is a resource
										$scope.next = result.collectionElements[index+1];
									} else {
										// next is a rubric
										$scope.next = result.rubrics[result.collectionElements[index+1]].resources[0];
									}
								} else {
									// i'm the last. no next resource
									$scope.next = false;
								}
							}
						});
						// find next if id is in rubric
						if ($scope.next === undefined) {
							// i'm not top level - see if i'm in a rubric
							angular.forEach(result.rubrics, function(rubric) {
								var index = rubric.resources.indexOf(id)
								  , rubricIndex = result.collectionElements.indexOf(rubric.id);
								if (index > -1) {
									// i'm inside this rubric
									if (index + 1 < rubric.resources.length) {
										// there are more
										$scope.next = rubric.resources[index+1];
									} else {
										// i'm the last one
										if (rubricIndex + 1 < resource.collectionElements.length) {
											// there are more rubrics
											$scope.next = resource.rubrics[resource.collectionElements[rubricIndex + 1]].resources[0];
										} else {
											// nothing more. should not have happened.
											$scope.next = false;
										}
									}
								}
							});
						}
					});
			}
		});

	$scope.jump = function(to) {
		$scope.media.forEach(function(elem) {
			// 0 == HAVE_NOTHING
			// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
			if (elem.readyState !== 0) {
				if (elem.tagName == 'AUDIO') {
					elem.currentTime = to + 7;
				} else {
					elem.currentTime = to;
				}
			}
		});
	};

	$scope.sync = function(args) {
		var elem = document.getElementById('lecturer');
		if (isNaN(elem.duration)) {
			delete $scope.sources.lecturer;
		} else {
			elem.currentTime = args.target.currentTime;
		}
	};

	$scope.$on('$locationChangeStart', function(event, next) {
		if (next.indexOf('collection') > -1) {
			$scope.$parent.animation = 'to-left';
		} else {
			$scope.$parent.animation = 'none';
		}
	});

	// ===== pulldown menu ==========================================
	$scope.showPulldownMenu = false;
	$scope.drag = function(event) {
		if (!$scope.showPulldownMenu && $(window).scrollTop() === 0 && event.gesture.deltaY > 100) {
			$scope.showPulldownMenu = true;
		} else if ($scope.showPulldownMenu && event.gesture.deltaY < -100) {
			$scope.showPulldownMenu = false;
		}
	};
});