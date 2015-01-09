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
	gulp.src("www/app/vendor/*.js")
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest("www/app/_build"))
		.pipe(notify("Vendors successfully concatenated!"));
});

// Concat angular dependencies
var ngConcat = function(name) {
	gulp.src("www/app/" + name + "/**/*.js")
		.pipe(concat(name + ".js"))
		.pipe(ngAnnotate({
			add: true
		}))
		.pipe(uglify())
		.pipe(gulp.dest("www/app/_build"))
		.pipe(notify(name + ".js successfully concatenated!"));
};

// Concatenate Sections
gulp.task("concat-sections", function() {
	ngConcat("sections");
});

// Concatenate Utilities
gulp.task("concat-utilities", function() {
	ngConcat("utilities");
});

// Watch directories and execute assigned tasks
gulp.task("watch", function() {
	gulp.watch("www/app/vendor/*.js", ["concat-vendor"]);
	gulp.watch("www/app/sections/**/*.js", ["concat-sections"]);
	gulp.watch("www/app/utilities/**/*.js", ["concat-utilities"]);

	gulp.watch("www/assets/css/include/**/*.sass", ["sass"]);
});

gulp.task("default", function() {
	gulp.start("watch");
});