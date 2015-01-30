module.exports = function (config) {
	config.set({
		basePath: '.',

		frameworks: ['jasmine'],

		files: [
			"vendor/*.js",
			"vendor/_src/angular-1.3.2/angular-mocks.js",
			"app.js",
			"lodash/*.js",
			"sections/**/*.js",
			"test/*.js"
		],

		exclude: [],

		port: 9001,

		logLevel: config.LOG_INFO,

		autoWatch: false,

		browsers: ["PhantomJS"],

		singleRun: true
	});
};