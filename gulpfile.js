// Dependencies
var concat = require('gulp-concat'),
    express = require('express'),
    gulp = require('gulp'),
    karma = require('karma'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    typescript = require('gulp-tsc');

gulp.task('default', function () {
    gulp.start('watch');
    gulp.start('staticServer');
});

gulp.task('staticServer', function () {
    var server = express(),
        port = 8088;

    server.use(express.static('./'));
    server.all('/*', function (req, res) {
        res.sendFile('index.html', {root: './'});
    });

    server.listen(port);
    console.log('Express static server running for openmaths on port ' + port);
});

gulp.task('watch', function () {
    gulp.watch('app/**/*.ts', ['typescript']);
    gulp.watch('app/test/*.js', ['test']);
});

gulp.task('concatVendor', function () {
    gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        'bower_components/angular-loading-bar/build/loading-bar.min.js',
        'bower_components/lodash/lodash.min.js',
        'bower_components/perfect-scrollbar/js/min/perfect-scrollbar.jquery.min.js',
        'bower_components/rxjs/dist/rx.all.min.js'
    ])
        .pipe(plumber({errorHandler: onError}))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('app/dist'))
        .pipe(notify('Vendor compiled'));
});

gulp.task('test', function (done) {
    karma.server.start({
        configFile: process.cwd() + '/app/test/karma.conf.js'
    }, done);
});

gulp.task('typescript', function () {
    tsc('app');
});

function tsc(path) {
    gulp.src([
        path + '/**/*.ts',

        // Ignore specs, dist, and typings
        '!' + path + '/**/*.specs.ts',
        '!' + path + '/dist/**/*',
        '!' + path + '/typings/**/*'
    ], {base: path})
        .pipe(plumber({errorHandler: onError}))
        .pipe(typescript({
            target: 'ES5',
            sortOutput: true,
            sourceMap: false,
            removeComments: true
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path + '/dist'))
        .pipe(notify('Typescript compiled'));

    tscTest(path);
}

function tscTest(path) {
    gulp.src([
        path + '/**/*.ts',

        // Ignore dist and typings
        '!' + path + '/dist/**/*',
        '!' + path + '/typings/**/*'
    ], {base: path})
        .pipe(plumber({errorHandler: onError}))
        .pipe(typescript({
            target: 'ES5',
            sortOutput: true,
            sourceMap: false,
            removeComments: true
        }))
        .pipe(concat('all.js'))
        .pipe(gulp.dest(path + '/test'))
        .pipe(notify('Tests compiled'))
}

function onError(err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>'
    })(err);

    this.emit('end');
}