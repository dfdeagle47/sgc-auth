define([], function () {
	'use strict';

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		register: function (args) {
			/**
			 * Minimum required fields:
			 * - username (email)
			 * - password
			 */

			return Backbone.ajax({
				url: '/auth/local/register',
				type: 'POST',
				data: args,
				auth: false
			});
		},

		verifyEmail: function (args) {
			/**
			 * Minimum required fields:
			 * - username (email)
			 * - password
			 */

			var me = this;

			var deferred = Backbone.ajax({
				url: '/auth/local/verify_email',
				type: 'POST',
				data: args,
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
		},

		login: function (args) {
			/**
			 * Minimum required fields:
			 * - username (email)
			 * - password
			 */

			var me = this;

			var deferred = Backbone.ajax({
				url: '/auth/local/login',
				type: 'POST',
				data: args,
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
		},

		changePassword: function (args) {
			/**
			 * Minimum required fields:
			 * - password
			 * - newPassword
			 */

			var me = this;

			var deferred = Backbone.ajax({
				url: '/auth/local/change_password',
				type: 'POST',
				data: args,
				auth: true
			});

			deferred.done(function (results) {
				me.set('token', results.token, {
					localStorage: true
				});
			});

			return deferred;
		},

		logout: function (args) {
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
		},

		forgotPassword: function (args) {
			/**
			 * Minimum required fields:
			 * - username (email)
			 */

			return Backbone.ajax({
				url: '/auth/local/forgot_password',
				type: 'POST',
				data: args,
				auth: false
			});
		},

		resetPassword: function (args) {
			/**
			 * Minimum required fields:
			 * - username
			 * - password
			 * - token
			 */

			var me = this;

			var deferred = Backbone.ajax({
				url: '/auth/local/reset_password',
				type: 'POST',
				data: args,
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