describe('olwConfService', function() {
	var olwConf = null;

	beforeEach(module('olwConfService'));
	beforeEach(inject(function(olwConf) {
		olwConf = _olwConf_;
	}));

	it('should have a valid api url', inject(function() {
		expect(olwConf.api.indexOf('http') > -1).toBeTruthy();
	}));

	it('should convert a uuid to the corresponding cdn url', inject(function() {
		var uuid = '592a3c90-ccea-11e2-9734-005056bd73ad';
		expect(olwConf.uuidUrl(uuid)).toEqual(olwConf.cdn + '/59/2a/3c/90/cc/ea/11/e2/97/34/00/50/56/bd/73/ad');
	}));
});