define([], function () {
	'use strict';

	var Backbone = require('backbone');

	var defaultSync = Backbone.sync;

	Backbone.getBearer = function(){
		return 'bearer ' + localStorage.token;
	};

	Backbone.getAuthorization = function(){
		return {
			Authorization: Backbone.getBearer()
		};
	};

	Backbone.setAuthorization = function(newToken){
		return localStorage.token = newToken;
	};

	Backbone.sync = function(method, model, options) {
		if(options === undefined) {
			options = model;
			model = undefined;
		}

		options = _.defaults(options||{}, {
			contentType: 'application/json; charset=utf-8',
			auth:true
		});

		if (options.auth) {
			delete options.auth;	
			options.headers = _.extend(options.headers, Backbone.getAuthorization());
		}

		if (options.data) {
			options.data = JSON.stringify(options.data);
		}

		return defaultSync.apply(this, [method, model, options]);
	};

	// return {

		// progressNode: null,
		// requestsNode: null,
		// currentRequestsCount: 0,
		


		// showRequestsProgress: function (node) {
		// 	node.append('<div>Remaining requests ' + this.currentRequestsCount + '</div>');
		// },

		// showUploadProgress: function (node, update) {
		// 	var done = update.value;
		// 	var max = update.max;
		// 	node.append('<div>Upload progress ' + (done / (max / 100)) + '% !</div>');
		// },

		// completionHandler: function (xhr, textStatus) {
		// 	this.currentRequestsCount -= 1;
		// 	if(this.requestsNode) {
		// 		this.showRequestsProgress(this.requestsNode);
		// 	}
		// },

		// beforeSendHandler: function (xhr, settings) {
		// 	this.currentRequestsCount += 1;
		// },

		// uploadProgressHandler: function (event) {
		// 	if(event.lengthComputable && this.progressNode) {
		// 		this.showUploadProgress(this.progressNode, {
		// 			value: event.loaded,
		// 			max: event.total
		// 		});
		// 	}
		// },

		// methodWrapper: function (type, url, headers, contentType, data, cbError, cbSuccess) {
		// 	var me = this;
		// 	var promise = $.ajax({

		// 		// progress: function () {
		// 		// 	me.uploadProgressHandler.apply(me, arguments);
		// 		// },
		// 		// beforeSend: function () {
		// 		// 	me.beforeSendHandler.apply(me, arguments);
		// 		// },
		// 		// complete: function () {
		// 		// 	me.completionHandler.apply(me, arguments);
		// 		// },

		// 		contentType: contentType || 'application/json; charset=utf-8',
		// 		//dataType: 'json',
		// 		success: cbSuccess,

		// 		error: cbError,

		// 		headers: headers,

		// 		data: (typeof data === 'object') && (type !== 'GET') ? JSON.stringify(data) : data,

		// 		type: type,

		// 		url: url
		// 	});

		// 	return def

			// promise.preventDefaultError = function(){
			// 	promise._preventDefaultError = true;
			// 	return this;
			// };

			// promise.fail(function(def, error){

			// 	//Client stop request
			// 	if (error && error.code && error.code == 100) {
			// 		app.nc.trigger('Ajax-error', {def:def, error:error});
			// 		return;
			// 	};

			// 	if (!def.status) {
			// 		app.nc.trigger('socket:no_response');
			// 	};
				
			// 	if(!promise._preventDefaultError && typeof App.onError == "function"){
			// 		App.onError(def);
			// 	}
			// });

			// return promise;
		// },
		// authorization: function () {
		// 	return {
		// 		Authorization: App.store.getBearer()
		// 	};
		// },

		// ajax: function (options) {
		// 	var url = options.url;

		// 	var data = options.data;
		// 	var method = options.type.toLowerCase();
		// 	//var headers = options.auth ? this.authorization() : {};
		// 	var headers = this.authorization();
		// 	(headers['Authorization'] == null) && (headers = {});
		// 	var contentType = options.contentType;
		// 	if(options.dataType != null) {
		// 		headers.dataType = options.dataType;
		// 	}
		// 	var cbError = options.error;
		// 	var cbSuccess = options.success;
		// 	if(method=="patch")
		// 		method = "put";

		// 	return this[method](url, headers, contentType, data, cbError, cbSuccess) || cbError();
		// },

		// constructor: function (options) {
		// 	$.extend(this, options);
		// 	var originalXhr = $.ajaxSettings.xhr;
		// 	$.ajaxSetup({
		// 		xhr: function () {
		// 			var req = originalXhr();
		// 			var me = this;
		// 			return req;
		// 		}
		// 	});
		// 	var me = this;
		// 	Backbone.ajax = function () {
		// 		return me.ajax.apply(me, arguments);
		// 	};
		// },

		// delete: function (url, headers, contentType, data, cbError, cbSuccess) {
		// 	return this.methodWrapper('DELETE', url, headers, contentType, data, cbError, cbSuccess);
		// },
		// post: function (url, headers, contentType, data, cbError, cbSuccess) {
		// 	return this.methodWrapper('POST', url, headers, contentType, data, cbError, cbSuccess);
		// },
		// put: function (url, headers, contentType, data, cbError, cbSuccess) {
		// 	return this.methodWrapper('PUT', url, headers, contentType, data, cbError, cbSuccess);
		// },
		// get: function (url, headers, contentType, data, cbError, cbSuccess) {
		// 	return this.methodWrapper('GET', url, headers, contentType, data, cbError, cbSuccess);
		// }
	// };

});