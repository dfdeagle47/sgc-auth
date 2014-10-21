define([], function () {
	'use strict';

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		googleLogin: function () {
			return Backbone.ajax({
				url: '/auth/google/login',
				type: 'GET',
				auth: false
			});
		},

		googleLoginPopup: function () {
			var GoogleWindow = window.open(
				'/auth/google/login',
				'Google connect',
				// ''
				'scrollbars=yes,width=650,height=500' // TODO % not pixels
			);

			var deferred = $.Deferred();

			var polling = window.setInterval(function() {
				if (GoogleWindow.closed !== false) {
					window.clearInterval(polling);
					if (this.get('token').length === 256) {
						deferred.resolve();
					}
					else {
						deferred.reject();
					}
				}
			}.bind(this), 10);

			deferred
			.done(function () {
				this.set('state', 'logged-in');
			}.bind(this))
			.fail(function () {
				this.set('state', 'logged-out');
			}.bind(this));

			return deferred.promise();
		},

		googleCallback: function (args) {
			this.set('token', args.token, {
				localStorage: true
			});
			this.set('state', 'logged-in');

			var deferred = $.Deferred();

			if(this !== top) {
				window.close();
			}

			setTimeout(function () {
				deferred.resolve();
			}, 100);

			return deferred.promise();
		}

	});

});