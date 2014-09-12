define([
	'sgc-auth',
	'chai'
], function (SGCAuth, chai) {
	'use strict';

	return function(){

		chai.should();

		var AuthModel = SGCAuth;

		//Events
		describe('Auth - Helpers', function () {
			//Chech clear method
			it('Test Clear localStorage model', function(){
				var model = new AuthModel();
				model.set('storedAttr', 'yvan', {localStorage:true});
				model.set('unStoredAttr', 'francois');

				model.clear();

				chai.assert.equal(model.get('storedAttr'), undefined);
				chai.assert.equal(localStorage.storedAttr, undefined);
				chai.assert.equal(model.get('unStoredAttr'), undefined);

				chai.assert.equal(_.keys(model._localStorageAttributes).length, 0);
			});
		});	
	};
});
