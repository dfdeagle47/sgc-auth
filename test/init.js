require.config({
	deps: ['sgc-auth', 'test'],
	shim: {
		jquery: {
			exports: '$'
		},
		underscore: {
			exports: '_'
		},
		backbone: {
			exports: 'Backbone',
			deps: ['jquery', 'underscore']
		},
		'sgc-auth': {
			deps: ['backbone']
		}
	},
	paths: {
		jquery: '../bower_components/jquery/dist/jquery.min',
		backbone: '../bower_components/backbone/backbone',
		underscore: '../bower_components/underscore/underscore',

		mocha: '../node_modules/mocha/mocha',
		chai: '../node_modules/chai/chai',

		'sgc-auth': '../src/sgc-auth',
		// 'sgc-model': '../dist/sgc-model.min',

		'test': '../test/test'
	},
	baseUrl: '../src'
});
