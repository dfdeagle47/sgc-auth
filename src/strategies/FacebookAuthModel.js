define([], function () {
	'use strict';

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		facebookLogin: function () {
			return Backbone.ajax({
				url: '/auth/facebook/login',
				type: 'GET',
				auth: false
			});
		},

		facebookLoginPopup: function () {
			var FacebookWindow = window.open(
				'/auth/facebook/login',
				'Facebook connect',
				// ''
				'scrollbars=yes,width=650,height=500' // TODO % not pixels
			);

			var deferred = $.Deferred();

			var polling = window.setInterval(function() {
				if (FacebookWindow.closed !== false) {
					window.clearInterval(polling);
					var token = this.get('token');
					if (token && token.length === 256) {
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

		facebookCallback: function (args) {
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