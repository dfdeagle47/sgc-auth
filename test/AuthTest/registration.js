define([
	'sgc-auth',
	'chai'
], function (SGCAuth, chai) {
	'use strict';

	return function(){

		chai.should();

		var AuthModel = SGCAuth;

		//Events
		describe('Auth - Registration process', function () {

			it('Registration process', function(done){

				var model = new AuthModel();
				model.testUrl = 'http://localhost:9000';

				model.clear();

				var username = 'test_registration_'+(Math.floor(Math.random()*1000000))+'@sagacify.com';

				var password = 'password_'+(Math.floor(Math.random()*1000000));

				model.register({
					username: username,
					password: password,
					firstname: 'TEST CLIENT',
					lastname: 'SAGACIFY',
					lang: 'fr'
				}).done(function(){
					done();
				})
				.fail(function(){
					console.log('done');
					done('Error while registration');
				});
			});

		});	
	};
});
