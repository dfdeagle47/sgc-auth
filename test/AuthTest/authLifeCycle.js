define([
	'sgc-auth',
	'chai'
], function (SGCAuth, chai) {
	'use strict';

	return function(){

		chai.should();

		var AuthModel	 = SGCAuth;

		//Events
		describe('Test Auth Model - Life cycle - setter', function () {
			
			it('Test persistant getter and setter in local storage', function(){
				var model = new AuthModel();

				model.set('Attribstore', 'yvan', {localStorage:true});

				localStorage.Attribstore.should.equal('yvan');
				model.get('Attribstore').should.equal('yvan');
			});

			it('Test getter and setter without local storage', function(){
				var model = new AuthModel();
				model.set('Attribstore', 'yvan');
				model.get('Attribstore').should.equal('yvan');
			});


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
