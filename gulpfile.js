// Dependencies
var gulp =
	require("gulp"),
	sass = require("gulp-ruby-sass"),
	autoprefixer = require("gulp-autoprefixer"),
	uglify = require("gulp-uglify"),
	concat = require("gulp-concat"),
	ngAnnotate = require("gulp-ng-annotate"),
	notify = require("gulp-notify");

// Compile SASS
gulp.task("sass", function() {
	gulp.src("www/assets/css/include/screen.sass")
		.pipe(sass({
			loadPath: process.cwd() + "/www/assets/css/include",
			style: "nested"
		}))
		.pipe(autoprefixer("last 2 version", "> 1%"))
		.pipe(gulp.dest("www/assets/css"))
		.pipe(notify("SASS successfully compiled!"));
});

// Concatenate Controllers
gulp.task("concat-controllers", function() {
	gulp.src("www/lib/controllers/*.js")
		.pipe(concat("controllers.js"))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest("www/lib/_build"))
		.pipe(notify("Controllers successfully concatenated!"));
});

// Concatenate Directives
gulp.task("concat-directives", function() {
	gulp.src("www/lib/directives/*.js")
		.pipe(concat("directives.js"))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest("www/lib/_build"))
		.pipe(notify("Directives successfully concatenated!"));
});

// Concatenate LoDash Custom Library
gulp.task("concat-lodash-custom", function() {
	gulp.src("www/lib/lodash/*.js")
		.pipe(concat("lodash.js"))
		.pipe(uglify())
		.pipe(gulp.dest("www/lib/_build"))
		.pipe(notify("LoDash Custom Library successfully concatenated!"));
});

// Concatenate Vendor
gulp.task("concat-vendor", function() {
	gulp.src("www/lib/vendor/*.js")
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest("www/lib/_build"))
		.pipe(notify("Vendors successfully concatenated!"));
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