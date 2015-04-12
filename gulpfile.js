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

// Concatenate our AngularJS App into a single omApp.js file
gulp.task("concat-ng", function () {
	gulp.src([
		"www/app/app.js",
		"www/app/lodash/**/*.js",
		"www/app/sections/**/*.js"
	])
		.pipe(concat("omApp.js"))
		.pipe(ngAnnotate({
			add: true
		}))
		.pipe(uglify())
		.pipe(gulp.dest("www/app/dist"))
		.pipe(notify("omApp.js successfully concatenated!"));
});

// Concatenate all resources (including vendor) into a single om.js file
gulp.task("concat-all", function () {
	gulp.src([
		"www/app/vendor/*.js",
		"www/app/dist/*.js"
	])
		.pipe(concat("om.js"))
		.pipe(gulp.dest("www/app"))
		.pipe(notify("om.js successfully concatenated!"));
});

// Watch directories and execute assigned tasks
gulp.task("watch", function () {
	gulp.watch("www/app/vendor/*.js", ["concat-ng", "test"]);
	gulp.watch("www/app/sections/**/*.js", ["concat-ng", "test"]);
	gulp.watch("www/app/lodash/*.js", ["concat-ng", "test"]);
	gulp.watch("www/app/test/*.js", ["concat-ng", "test"]);
	gulp.watch("www/app/dist/*.js", ["concat-all", "test"]);

	gulp.watch("www/assets/css/include/**/*.sass", ["sass"]);
});

gulp.task("default", ["sass"], function () {
	gulp.start("watch");
	gulp.start("concat-ng");
	gulp.start("staticServer");
});