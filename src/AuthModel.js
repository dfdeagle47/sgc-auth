define([], function () {
	'use strict';

	var Backbone = require('backbone');

	return Backbone.Model.extend({

		sync: function(method, model, options){
			if (options.url && this.testUrl) {
				options.url = this.testUrl+options.url;
				options.headers = { 'Access-Control-Allow-Origin': '*' };
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
			options = _.defaults(options||{}, {
				localStorage:false
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
			};

			return Backbone.Model.prototype.has.apply(this, arguments);
		},

		get: function(attr){
			var val = Backbone.Model.prototype.get.apply(this, arguments);

			if (!val && this.getLocalStorageAttributes()[attr]) {
				return localStorage[attr];
			}
			
			return val;
		},

		clear: function(){
			// remove local storage
			var localAttributes = _.keys(this.getLocalStorageAttributes());
			for (var i = localAttributes.length - 1; i >= 0; i--) {
				delete localStorage[localAttributes[i]];
			}

			this._localStorageAttributes = {};

			var res = Backbone.Model.prototype.clear.apply(this, arguments);

			return res;
		},

		register: function(args) {
			return this.sync(null, this, {
				url: '/auth/user/register',
				type: 'POST',
				data: args,
				auth:false
			});
		},

		validateToken: function(username, password, token) {
			var me = this;
			return this.sync(null, this, {
				url: '/auth/validation',
				type: 'POST',
				data: {
					username: username,
					password: password,
					token: token
				}, 
				auth:false
			})
			.done(function(results){
				if(('token' in results) && ('user' in results)) {
					//TODO CONFIG USERS
					me.set('token', results.token, {localStorage:true});
					me.set('id', results.user.username, {localStorage:true});
				}
			})
			.fail(function(){
				me.clear();
			});
		},

		login: function (username, password) {
			var def = $.Deferred();
			var me = this;
			this.sync(null, this, {
				url: '/auth/login',
				type: 'POST',
				data: {
					username: username,
					password: password
				},
				auth:false, 

				success: function(results){
					if(('token' in results) && ('user' in results)) {
						me.set('token', results.token, {localStorage:true});
						me.set('id', results.user.username, {localStorage:true});
						def.resolve();
						me.set('state', 'LOGIN');
					} else {
						def.reject();
					}
				}

			})
			.fail(function(){
				me.clear();
				def.reject();
			});

			return def.promise();
		},

		forgotPassword: function (username, lang) {
			return this.sync(null, this, {
				url: '/auth/forgot_password',
				type: 'POST',
				data: {
					username: username,
					lang: lang
				},
				auth:false
			});
		},

		changePassword: function (current_password, new_password) {
			var me = this;
			return this.sync(null, this, {
				url: '/auth/change_password',
				type: 'POST',
				data: {
					password: current_password,
					new_password: new_password
				},
				auth: true				
			})
			.done(function (results) {
				if('token' in results) {
					me.set('token', results.token, {localStorage:true});
				}
			});			

			// var me = this;
			// var deferred = SGAjax.ajax({
			// 	url: '/auth/change_password',
			// 	type: 'POST',
			// 	data: {
			// 		password: current_password,
			// 		new_password: new_password
			// 	},
			// 	auth: true
			// });

			// deferred.done(function (results) {
			// 	if('token' in results) {
			// 		App.store.set('token', results.token);
			// 	}
			// });

			// return deferred;
		},

		logout: function () {
			var def = this.sync(null, this, {
				url: '/auth/logout',
				type: 'POST',
				data: {},
				dataType:undefined,
				auth: true
			});

			this.clear();
			this.set('state', 'LOGOUT');
			
			return def;

			// var me = this;
			// var deferred = SGAjax.ajax({
			// 	url: '/auth/logout',
			// 	type: 'POST',
			// 	data: {},
			// 	auth: true
			// });

			// App.store.clear();
			// App.layout.isLoggedOut();

			// return deferred;
		},

		resetPassword: function (username, password, token) {
			var me = this;
			return this.sync(null, this, {
				url: '/auth/user/reset_password',
				type: 'POST',
				data: {
					username: username,
					password: password,
					token: token
				},
				auth:false
			})
			.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					me.set('token', results.token, {localStorage:true});
					me.set('id', results.user.username, {localStorage:true});

					// App.user = new App.models.UserModel(results.user, {
					// 	custom_url:'/api/user'
					// });
					// App.layout.isLoggedIn(); // not sure it should be called ?!
				}
			});

			// var me = this;
			// var deferred = SGAjax.ajax({
			// 	url: '/auth/user/reset_password',
			// 	type: 'POST',
			// 	data: {
			// 		username: username,
			// 		password: password,
			// 		token: token
			// 	}
			// });

			// deferred.done(function (results) {
			// 	if(('token' in results) && ('user' in results)) {
			// 		App.store.set('token', results.token);
			// 		App.store.set('id', results.user.username);
			// 		App.user = new App.models.UserModel(results.user, {
			// 			custom_url:'/api/user'
			// 		});
			// 		App.layout.isLoggedIn(); // not sure it should be called ?!
			// 	}
			// });

			// return deferred;
		},

		reverse_validation: function (data, id, token) {
			var url = '/auth/reverse_validation';
			if(id && token) {
				url += '?token=' + token + '&id=' + id;
			}

			var me = this;

			return this.sync(null, this, {
				url: url,
				type: 'POST',
				data: data				
			})
			.done(function (results) {
				if(('token' in results) && ('user' in results)) {
					//TODO CONFIG USERS
					me.set('token', results.token, {localStorage:true});
					me.set('id', results.user.username, {localStorage:true});
					App.layout.isLoggedIn();

					// supp
					me.set('_id', results.user._id, {localStorage:true});
					me.set('slug', results.user.slug, {localStorage:true});

					// var avatar = results.user.avatar;
					// if(avatar) {
					// 	App.store.set('avatar', avatar);
					// }
					// App.nc.trigger('user:first_load', results);
					// App.SocketManager.reload();
					// App.router.navigate('dashboard');
				}
			})
			.fail(function () {
				me.clear();
				// App.store.logout();
				// App.memory && App.memory.free();
			});

			// var me = this;
			// var deferred = SGAjax.ajax({
			// 	url: url,
			// 	type: 'POST',
			// 	data: data
			// });

			// deferred.done(function (results) {
			// 	if(('token' in results) && ('user' in results)) {
			// 		//TODO CONFIG USERS
			// 		App.store.set('token', results.token);
			// 		App.store.set('id', results.user.username);
			// 		App.layout.isLoggedIn();

			// 		// supp
			// 		App.store.set('_id', results.user._id);
			// 		App.store.set('slug', results.user.slug);
			// 		var avatar = results.user.avatar;
			// 		if(avatar) {
			// 			App.store.set('avatar', avatar);
			// 		}
			// 		App.nc.trigger('user:first_load', results);
			// 		App.SocketManager.reload();
			// 		App.router.navigate('dashboard');
			// 	}
			// })
			// .fail(function (error) {
			// 	App.store.logout();
			// 	App.memory && App.memory.free();
			// });

			// return deferred;
		}


	});

});