define('SGAjax',[], function () {
	

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
			contentType: 'application/json; charset=utf-8',
			auth: true
		});

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
define('strategies/FacebookAuthModel',[], function () {
	

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
			.done(function (results) {
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
define('strategies/GoogleAuthModel',[], function () {
	

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		googleLogin: function () {
			var me = this;

			var deferred = Backbone.ajax({
				url: '/auth/google/login',
				type: 'GET',
				auth: false
			});

			deferred
			.done(function (results) {
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
define('strategies/LocalAuthModel',[], function () {
	

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		localRegister: function (args) {
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

		localVerifyEmail: function (args) {
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
			.done(function (results) {
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

		localLogin: function (args) {
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
			.done(function (results) {
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

		localChangePassword: function (args) {
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

		localLogout: function (args) {
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

		localForgotPassword: function (args) {
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

		localResetPassword: function (args) {
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
			.done(function (results) {
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
define('AuthModel',[
	'./strategies/FacebookAuthModel',
	'./strategies/GoogleAuthModel',
	'./strategies/LocalAuthModel'
], function (
	FacebookAuthModel,
	GoogleAuthModel,
	LocalAuthModel
) {
	

	var Backbone = require('backbone');

	var AuthModel = Backbone.Model.extend({

		sync: function (method, model, options){
			if (options.url && this.testUrl) {
				options.url = this.testUrl+options.url;
				options.headers = {
					'Access-Control-Allow-Origin': '*'
				};
			}
			if (!method) {
				method = 'read';
			}

			return Backbone.Model.prototype.sync.apply(this, [method, model, options]);
		},

		getLocalStorageAttributes : function(){
			if (!this._localStorageAttributes) {
				this._localStorageAttributes = {};
			}

			return this._localStorageAttributes;
		},

		set: function(attr, raw, options){
			_.defaults(options || {}, {
				localStorage: false
			});

			if (options.localStorage) {
				if (_.isString(attr)) {
					localStorage[attr] = raw;
					this.getLocalStorageAttributes()[attr] = true;
				}
				return;
			}

			return Backbone.Model.prototype.set.apply(this, arguments);
		},

		has: function(attr){
			if (attr in this.getLocalStorageAttributes()) {
				return true;
			}

			return Backbone.Model.prototype.has.apply(this, arguments);
		},

		get: function(attr){
			var val = Backbone.Model.prototype.get.apply(this, arguments);

			if (!val && this.getLocalStorageAttributes()[attr]) {
				return localStorage[attr];
			}
			
			return val;
		},

		clear: function () {
			var localAttributes = this.getLocalStorageAttributes();
			for (var localAttribute in localAttributes) {
				delete localStorage[localAttribute];
			}

			this._localStorageAttributes = {};

			return Backbone.Model.prototype.clear.apply(this, arguments);
		}

	});

	_.extend(AuthModel, FacebookAuthModel);
	_.extend(AuthModel, GoogleAuthModel);
	_.extend(AuthModel, LocalAuthModel);

	return AuthModel;

});
define('sgc-auth',['require','./SGAjax','./AuthModel'],function (require) {
	

	require('./SGAjax');
	return require('./AuthModel');

});
