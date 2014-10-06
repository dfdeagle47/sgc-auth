define([], function () {
	'use strict';

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		bearerLogout: function (args) {
			/**
			 * No required fields.
			 */

			var deferred = Backbone.ajax({
				url: '/auth/bearer/logout',
				type: 'POST',
				data: args,
				auth: true
			});

			this.clear();
			this.set('state', 'logged-out');
			
			return deferred;
		}

	});

});