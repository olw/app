angular.module('olwSectionsService', ['olwDasherizeFilter', 'ng'])

.factory('sections', ['$filter', function($filter) {
    var sections = {
        orderedSectionSlugs: ['iw', 'nw', 'gw'],
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
        getPathElement: function(title, id) {
			return [$filter('dasherize')(title), id].join('-');
		},
        getSlugForArea: function(area) {
			for (var slug in sections.sections) {
				if (sections.sections.hasOwnProperty(slug)) {
					if (sections.isAreaInSection(slug, area)) {
						return slug;
					}
				}
			}
		},
        isAreaInSection: function(sectionSlug, areaTitle) {
            try {
				for (var i = 0; i < sections.sections[sectionSlug].content.length; i++) {
					if (sections.sections[sectionSlug].content[i].title == areaTitle) {
						return true;
					}
				}
				return false;
			} catch (exception) {
				return false;
			}
        }
    };
    
    return sections;
}]);