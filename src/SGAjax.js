define([], function () {
	'use strict';

	var Backbone = require('backbone');

	Backbone.getBearer = function(){
		return 'bearer ' + localStorage.token;
	};

	Backbone.getAuthorization = function(){
		return {
			Authorization: Backbone.getBearer()
		};
	};

	Backbone.setAuthorization = function (newToken) {
		return localStorage.token = newToken;
	};

	Backbone.ajax = function (options) {
		options = _.defaults(options || {}, {
			// contentType: 'application/json; charset=utf-8',
			auth: true
		});

		options.contentType = 'application/json; charset=utf-8';

		if (options.auth) {
			delete options.auth;
			options.headers = _.extend(
				options.headers || {},
				Backbone.getAuthorization()
			);
		}

		if (options.data) {
			options.data = JSON.stringify(options.data);
		}

		return Backbone.$.ajax.apply(Backbone.$, arguments);
	};

});