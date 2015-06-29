var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var replace = require('gulp-replace');
var fs = require('fs');

var filesjs = "./src/js/*.js";
var filesscss = "./src/sass/*.scss";
var filescss = "./src/css/main.css";
var filehtml = "./src/index.html";
var templates = "./src/templates/**/*";

gulp.task('lint', function() {

    return gulp.src(filesjs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

});

gulp.task('sass', function() {
    return gulp.src(filesscss)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('cssmin', ['sass'], function() {
    return gulp.src(filescss)
        .pipe(minifyCss())
        .pipe(rename("main.min.css"))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('uglify', function() {
    return gulp.src("./src/js/dribbble.js")
        .pipe(rename('dribbble.min.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest('./src/js'));

});

gulp.task('dist', ['cssmin', 'uglify'], function() {

    gulp.src(["./src/js/api/ng-infinite-scroll.min.js", "./src/js/api/lazy-image.min.js", "./src/js/dribbble.min.js"])
        .pipe(concat("dribbble.min.js"))
        .pipe(gulp.dest('./dist/js'));

    gulp.src(templates)
        .pipe(gulp.dest('./dist/templates'));

    gulp.src(filehtml)
        .pipe(rename("item.html"))
        .pipe(gulp.dest('src/'))
        .pipe(rename("index.html"))
        .pipe(htmlreplace({
            'js': 'js/dribbble.min.js'
        }))
        .pipe(replace(/<link href="css\/main.css"[^>]*>/, function(s, filename) {
            var style = fs.readFileSync("src/css/main.min.css", 'utf8');
            return '<style>\n' + style + '\n</style>';
        }))
        .pipe(gulp.dest('dist/'))
        .pipe(rename("item.html"))
        .pipe(gulp.dest('dist/'));

});

gulp.task('default', ['dist'], function() {

    gulp.watch([filesjs, filesscss, filehtml, templates], ['lint', 'dist']);

});