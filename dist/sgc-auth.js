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

		if (_.isObject(options.data) || _.isArray(options.data)) {
			options.data = JSON.stringify(options.data);
		}

		return Backbone.$.ajax.apply(Backbone.$, arguments);
	};

});
define('strategies/FacebookAuthModel',[], function () {
	

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
define('strategies/GoogleAuthModel',[], function () {
	

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
define('strategies/BearerAuthModel',[], function () {
	

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
define('strategies/LocalAuthModel',[], function () {
	

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		localEasyRegister: function (args) {
			/**
			 * /!\ No email verification is done /!\
			 * Minimum required fields:
			 * - username (email)
			 * - password
			 */

			var me = this;

			var deferred = Backbone.ajax({
				url: '/auth/local/easy_register',
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
				me.set('state', 'logged-out');
			});

			return deferred;
		},

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
				me.set('state', 'logged-out');
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
				me.set('state', 'logged-out');
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

			deferred
			.done(function (results) {
				me.set('token', results.token, {
					localStorage: true
				});
			});

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
				me.set('state', 'logged-out');
			});

			return deferred;
		}

	});

});
define('AuthModel',[
	'./strategies/FacebookAuthModel',
	'./strategies/GoogleAuthModel',
	'./strategies/BearerAuthModel',
	'./strategies/LocalAuthModel'
], function (
	FacebookAuthModel,
	GoogleAuthModel,
	BearerAuthModel,
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
			options = _.defaults(options || {}, {
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

			if (!val && (attr in localStorage) /*&& this.getLocalStorageAttributes()[attr]*/) {
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

	_.extend(AuthModel.prototype, FacebookAuthModel.prototype);
	_.extend(AuthModel.prototype, GoogleAuthModel.prototype);
	_.extend(AuthModel.prototype, BearerAuthModel.prototype);
	_.extend(AuthModel.prototype, LocalAuthModel.prototype);

	return AuthModel;

});
define('sgc-auth',['require','./SGAjax','./AuthModel'],function (require) {
	

	require('./SGAjax');

	return require('./AuthModel');

});
