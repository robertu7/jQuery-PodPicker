var gulp       = require('gulp'),
    plumber    = require('gulp-plumber'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS  = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    babel      = require("gulp-babel");


var paths = {
    babel: ['src/jquery.podpicker.babel.js'],
    js   : ['dist/jquery.podpicker.js']
};

// ES6
gulp.task("es6", function () {
  return gulp.src(paths.babel)
    .pipe(plumber())
    .pipe(babel())
    .pipe(concat('jquery.podpicker.js'))
    .pipe(gulp.dest("dist"));
});

// Minify JavaScript
gulp.task('js', function() {

    return gulp.src(paths.js)
        .pipe(plumber())
        .pipe(sourcemaps.init())
            .pipe(uglify({preserveComments: 'some'}))
            .pipe(concat('jquery.podpicker.min.js'))
            .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});


// Rerun the task when a file changes 
gulp.task('watch', function() {
    gulp.watch(paths.babel, ['es6']);
    gulp.watch(paths.js, ['js']);
});

// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['watch', 'es6', 'js']);