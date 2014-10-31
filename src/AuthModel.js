define([
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
	'use strict';

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