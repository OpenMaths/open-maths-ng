// Dependencies
var gulp =
	require("gulp"),
	sass = require("gulp-ruby-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	minifycss = require("gulp-minify-css"),
	concat = require("gulp-concat"),
	ngAnnotate = require("gulp-ng-annotate"),
	plumber = require("gulp-plumber"),
	notify = require("gulp-notify");

var onError = notify.onError({
	title: "Your SASS is broken!",
	subtitle: "<%= file %> did not compile!",
	message: "<%= error.message %>"
});

// Compile SASS
gulp.task("sass", function() {
	gulp.src("www/assets/css/include/screen.sass")
		.pipe(plumber({
			errorHandler: onError
		}))
		.pipe(plumber({ errorHandler: onError }))
		.pipe(sass({
			loadPath: process.cwd() + "/www/assets/css/include",
			style: "nested"
		}))
		.pipe(autoprefixer("last 20 version", "> 1%"))
		.pipe(gulp.dest("www/assets/css"))
		.pipe(rename({suffix: ".min"}))
		.pipe(minifycss())
		.pipe(gulp.dest("www/assets/css"))
		.pipe(notify("SASS successfully compiled!"));
});

// Concatenate Vendor
gulp.task("concat-vendor", function() {
	gulp.src("www/lib/vendor/*.js")
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest("www/lib/_build"))
		.pipe(notify("Vendors successfully concatenated!"));
});

// Concat angular dependencies
var ngConcat = function(name) {
	gulp.src("www/lib/" + name + "/*.js")
		.pipe(concat(name + ".js"))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest("www/lib/_build"))
		.pipe(notify(name + ".js successfully concatenated!"));
};

// Concatenate Controllers
gulp.task("concat-controllers", function() {
	ngConcat("controllers");
});

// Concatenate Directives
gulp.task("concat-directives", function() {
	ngConcat("directives");
});

// Concatenate LoDash Custom Library
gulp.task("concat-lodash-custom", function() {
	ngConcat("lodash");
});

// Watch directories and execute assigned tasks
gulp.task("watch", function() {
	gulp.watch("www/lib/controllers/*.js", ["concat-controllers"]);
	gulp.watch("www/lib/directives/*.js", ["concat-directives"]);
	gulp.watch("www/lib/lodash/*.js", ["concat-lodash-custom"]);
	gulp.watch("www/lib/vendor/*.js", ["concat-vendor"]);

	gulp.watch("www/assets/css/include/**/*.sass", ["sass"]);
});

gulp.task("default", function() {
	gulp.start("watch");
});