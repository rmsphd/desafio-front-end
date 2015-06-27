var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var sass = require('gulp-sass');

var filesjs = "./src/js/*.js";
var filesscss = "./src/sass/*.scss";
var filehtml = "./src/*.html";

gulp.task('lint', function() {

    gulp.src(filesjs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

});

gulp.task('sass', function() {
    gulp.src(filesscss)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('dist', ['sass'], function() {

    gulp.src("./src/js/api/*.min.js")
        .pipe(gulp.dest('./dist/js/api'));

    gulp.src("./src/css/**/*")
        .pipe(gulp.dest('./dist/css'));

    gulp.src("./src/js/dribbble.js")
        .pipe(rename('dribbble.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));

    gulp.src(filehtml)
        .pipe(htmlreplace({
            'js': 'js/dribbble.min.js'
        }))
        .pipe(gulp.dest('dist/'));

});

gulp.task('default', function() {

    gulp.watch([filesjs, filesscss, filehtml], ['lint', 'dist']);

});