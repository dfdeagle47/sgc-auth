define([
	'sgc-auth',
	'chai',
	'../test/AuthTest/authLifeCycle',
	'../test/AuthTest/helpers',
	'../test/AuthTest/loginLogout',
	// '../test/AuthTest/registration',
	'mocha'
], function (SGCModel, chai, authLifeCycle, helpers, loginLogout/*, registration*/) {
	'use strict';

	var mocha = window.mocha;

	mocha.setup('bdd');

	authLifeCycle();
	helpers();
	loginLogout();
	// Registration();

	if (window.mochaPhantomJS) {
		window.mochaPhantomJS.run();
	}
	else {
		mocha.run();
	}
});
