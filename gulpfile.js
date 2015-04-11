// Dependencies
var gulp = require("gulp"),
	sass = require("gulp-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	minifycss = require("gulp-minify-css"),
	size = require("gulp-filesize"),
	concat = require("gulp-concat"),
	ngAnnotate = require("gulp-ng-annotate"),
	plumber = require("gulp-plumber"),
	notify = require("gulp-notify"),
	karma = require("karma").server,
	express = require("express"),
	expressPort = 9000;

var onError = notify.onError({
	title: "Your SASS is broken!",
	subtitle: "<%= file %> did not compile!",
	message: "<%= error.message %>"
});

var server = express();

gulp.task("test", function (done) {
	karma.start({
		configFile: process.cwd() + "/www/app/karma.conf.js"
	}, done);
});

gulp.task("staticServer", function () {
	server.use(express.static("www"));
	server.all("/*", function (req, res) {
		res.sendFile("index.html", {root: "www"});
	});

	server.listen(expressPort);
	console.log("Express static server running for open-maths-ng on port " + expressPort);
});

// Compile SASS
gulp.task("sass", function () {
	gulp.src("www/assets/css/include/screen.sass")
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(plumber({errorHandler: onError}))
		.pipe(sass({
			loadPath: process.cwd() + "/www/assets/css/include",
			style: "nested",
			indentedSyntax: true
		}))
		.pipe(autoprefixer("last 8 version", "> 1%"))
		.pipe(gulp.dest("www/assets/css"))
		.pipe(rename({suffix: ".min"}))
		.pipe(minifycss())
		.pipe(gulp.dest("www/assets/css"))
		.pipe(size())
		.pipe(notify("SASS successfully compiled!"));
});

// Concatenate Vendor
gulp.task("concat-vendor", function () {
	gulp.src("www/app/vendor/*.js")
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest("www/app/dist"))
		.pipe(notify("Vendors successfully concatenated!"));
});

// Concat angular dependencies
var ngConcat = function (name) {
	gulp.src("www/app/" + name + "/**/*.js")
		.pipe(concat(name + ".js"))
		.pipe(ngAnnotate({
			add: true
		}))
		.pipe(uglify())
		.pipe(gulp.dest("www/app/dist"))
		.pipe(notify(name + ".js successfully concatenated!"));
};

// Concatenate Sections
gulp.task("concat-sections", function () {
	ngConcat("sections");
});

// Concatenate Utilities
gulp.task("concat-lodash", function () {
	ngConcat("lodash");
});

// Concatenate all resources into a single omApp.js file
gulp.task("concat-all", function () {
	gulp.src([
		"www/app/dist/vendor.js",
		"www/app/config.js",
		"www/app/app.js",
		"www/app/dist/lodash.js",
		"www/app/dist/sections.js"
	])
		.pipe(concat("omApp.js"))
		.pipe(gulp.dest("www/app"))
		.pipe(size())
		.pipe(notify("omApp.js successfully concatenated!"));
});

// Watch directories and execute assigned tasks
gulp.task("watch", function () {
	gulp.watch("www/app/vendor/*.js", ["concat-vendor", "concat-sections", "concat-lodash"]);
	gulp.watch("www/app/sections/**/*.js", ["concat-vendor", "concat-sections", "concat-lodash"]);
	gulp.watch("www/app/lodash/*.js", ["concat-vendor", "concat-sections", "concat-lodash"]);
	gulp.watch("www/app/dist/*.js", ["concat-all", "test"]);

	gulp.watch("www/assets/css/include/**/*.sass", ["sass"]);
});

gulp.task("default", ["sass", "concat-vendor", "concat-sections", "concat-lodash", "concat-all"], function () {
	gulp.start("watch");
	gulp.start("staticServer");
});