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
    gulp.watch('app/**/*.ts', ['compile-tsc', 'compile-tsc-tests']);
    gulp.watch('app/test/*.js', ['test']);
});

gulp.task('concatVendor', function () {
    gulp.src([
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/angular/angular.min.js',
            'bower_components/angular-ui-router/release/angular-ui-router.min.js',
            'bower_components/angular-loading-bar/build/loading-bar.min.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js',
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
    var server = new karma.Server({
        configFile: process.cwd() + '/app/test/karma.conf.js'
    }, done);

    server.start();
});

gulp.task('compile-tsc', function () {
    tsc('app', 'app');
});

gulp.task('compile-tsc-tests', function () {
    tsc('app', 'tests');
});

function tsc(path, type) {
    if (type == 'tests' || type == 'app') {
        var tscSrc = {
            app: [
                path + '/**/*.ts',

                // Ignore specs, dist, and typings
                '!' + path + '/**/*.specs.ts',
                '!' + path + '/dist/**/*',
                '!' + path + '/typings/**/*'
            ],
            tests: [
                path + '/**/*.ts',

                // Ignore dist and typings
                '!' + path + '/dist/**/*',
                '!' + path + '/typings/**/*'
            ]
        };

        gulp.src(tscSrc[type], {base: path})
            .pipe(plumber({errorHandler: onError}))
            .pipe(typescript({
                target: 'ES5',
                sortOutput: true,
                sourceMap: false,
                removeComments: true
            }))
            .pipe(concat((type == 'tests' ? 'app+specs.js' : 'app.js')))
            .pipe(gulp.dest(path + (type == 'tests' ? '/test' : '/dist')))
            .pipe(notify(type.charAt(0).toUpperCase() + type.slice(1) + ' compiled'));
    } else {
        console.log('tsc parameter type needs to be "tests" or "app"');
        return false;
    }
}

function onError(err) {
    notify.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>'
    })(err);

    this.emit('end');
}