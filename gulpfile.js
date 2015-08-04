var gulp       = require('gulp'),
    plumber    = require('gulp-plumber'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCSS  = require('gulp-minify-css'),
    uglify     = require('gulp-uglify'),
    babel      = require("gulp-babel"),
    jshint     = require('gulp-jshint');


var paths = {
    babel: ['src/jquery.podpicker.babel.js'],
    js   : ['dist/jquery.podpicker.js']
};


// ES6 & Minify
gulp.task('js', function (){

    return gulp.src(paths.babel)
        // ES6
        .pipe(plumber())
        .pipe(babel({blacklist: ['strict']}))
        .pipe(concat('jquery.podpicker.js'))
        .pipe(gulp.dest("dist"))
        // Minify
        .pipe(sourcemaps.init())
            .pipe(uglify({preserveComments: 'some'}))
            .pipe(concat('jquery.podpicker.min.js'))
            .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});


// JSHint
gulp.task('jshint', function (){

    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
})


// Rerun the task when a file changes 
gulp.task('watch', function() {
    gulp.watch(paths.babel, ['js']);
    gulp.watch(paths.js, ['jshint']);
});


gulp.task('default', ['watch', 'js', 'jshint']);

