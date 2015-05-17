module.exports = function (config) {
	config.set({
		basePath: '.',
		frameworks: ['jasmine'],
		files: [
			'../dist/vendor.js',
			'../../bower_components/angular-mocks/angular-mocks.js',
			'all.js'
		],
		exclude: [],
		port: 3100,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		colors: true,
		browsers: ['PhantomJS'],
		singleRun: true
	});
};