// Karma configuration
module.exports = function(config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '.',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			"vendor/*.js",
			"vendor/_src/angular-1.3.2/angular-mocks.js",
			"app.js",
			"lodash/*.js",
			"sections/**/*.js",
			"test/*.js"
		],

		// list of files / patterns to exclude
		exclude: [],

		// web server port
		port: 9001,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ["PhantomJS"],


		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: true
	});
};