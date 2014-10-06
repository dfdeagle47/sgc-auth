define([], function () {
	'use strict';

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		facebookLogin: function () {
			var me = this;

			var deferred = Backbone.ajax({
				url: '/auth/facebook/login',
				type: 'GET',
				auth: false
			});

			deferred
			.done(function () {
				me.set('token', results.token, {
					localStorage: true
				});
				me.set('state', 'logged-in');
			})
			.fail(function (){
				me.clear();
			});

			return deferred;
		}

	});

});