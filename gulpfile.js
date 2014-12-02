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

// Concatenate Assets JS
gulp.task("concat-assets-js", function() {
	gulp.src("www/assets/js/include/*.js")
		.pipe(concat("app.js"))
		.pipe(uglify("app.js"))
		.pipe(gulp.dest("www/assets/js"))
		.pipe(notify("Assets JavaScript successfully compiled!"));
});

// Concatenate Controllers
gulp.task("concat-controllers", function() {
	gulp.src("www/lib/controllers/*.js")
		.pipe(concat("controllers.js"))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest("www/lib/controllers/_build"))
		.pipe(notify("Controllers successfully concatenated!"));
});

// Concatenate Directives
gulp.task("concat-directives", function() {
	gulp.src("www/lib/directives/*.js")
		.pipe(concat("directives.js"))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest("www/lib/directives/_build"))
		.pipe(notify("Directives successfully concatenated!"));
});

// Concatenate Vendor
gulp.task("concat-vendor", function() {
	gulp.src("www/lib/vendor/*.js")
		.pipe(concat("vendor.js"))
		.pipe(gulp.dest("www/lib/vendor/_build"))
		.pipe(notify("Vendors successfully concatenated!"));
});

// Watch directories and execute assigned tasks
gulp.task("watch", function() {
	gulp.watch("www/lib/controllers/*.js", ["concat-controllers"]);
	gulp.watch("www/lib/directives/*.js", ["concat-directives"]);
	gulp.watch("www/lib/vendor/*.js", ["concat-vendor"]);

	gulp.watch("www/assets/css/include/**/*.sass", ["sass"]);
	gulp.watch("www/assets/js/include/*.js", ["concat-assets-js"]);
});

gulp.task("default", function() {
	gulp.start("watch");
});