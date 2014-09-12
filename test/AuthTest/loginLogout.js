define([
	'sgc-auth',
	'chai'
], function (SGCAuth, chai) {
	'use strict';

	return function(){

		chai.should();

		var AuthModel = SGCAuth;

		//Events
		describe('Auth - Login', function () {

			it('First correct login authenticate', function(done){
				var model = new AuthModel();
				model.testUrl = 'http://localhost:9000';

				model.clear();

				model.login('yvan@sagacify.com', 'yvan').done(function(){
					if (model.get('token') && model.get('id')) {
						done();	
					} else {
						done('Fail');
					}
				})
				.fail(function(){
					done('Fail');
				});
			});

			it('First uncorrect login authenticate', function(done){
				var model = new AuthModel();
				model.testUrl = 'http://localhost:9000';

				model.clear();

				model.login('yvan@sagacify.com', 'yvan1').done(function(){
					done('Fail');
				})
				.fail(function(){
					done();
				});
			});



			it('Logout when user is logged', function(done){
				var model = new AuthModel();
				model.testUrl = 'http://localhost:9000';

				model.clear();

				model.login('yvan@sagacify.com', 'yvan').done(function(){
					model.logout()
					.done(function(){
						if (
							!model.get('token') && 
							!model.get('id') &&
							!localStorage.token && 
							!localStorage.id
							) {
							done();
						} else {
							done('Not completly removed');
						}
					})
					.fail(function(){
						done('Fail to logout');
					});
				})
				.fail(function(){
					done('Fail');
				});
			});



			it('Logout when user is already logout', function(done){
				var model = new AuthModel();
				model.testUrl = 'http://localhost:9000';

				model.clear();

				model.logout()
				.done(function(){
					//A discuter.
					done('Error');
				})
				.fail(function(){
					if (
						!model.get('token') && 
						!model.get('id') &&
						!localStorage.token && 
						!localStorage.id
						) {
						done();
					} else {
						done('Strange state');
					}
				});
			});

		});
	};
});
