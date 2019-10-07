const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const purgecss = require('gulp-purgecss');

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
        port: 3000,
        notify: false
    });
});

gulp.task('code', function() {
    return gulp.src('app/**/*.html').
        pipe(browserSync.reload({ stream: true }))
});

gulp.task('sass', function() {
    return gulp.src('dev/sass/**/*.sass')
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [__dirname + '/node_modules']
        }))
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({
            grid: true,
            overrideBrowserslist: ['last 10 versions']
        }))
        .pipe(cleancss({ level: { 1: { specialComments: 0 }}}))
        .pipe(gulp.dest('dev/css'))
        .pipe(browserSync.stream())
});

gulp.task('purgecss', () => {
    return gulp.src('dev/css/**/*.css')
        .pipe(purgecss({
            content: ['app/**/*.html']
        }))
        .pipe(gulp.dest('app/css'))
});

gulp.task('js', function() {
    return gulp.src([
        /*'dev/libs/jquery/jquery.js',*/
        'dev/js/**/*.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('serve', function() {
    gulp.watch('dev/sass/**/*.sass', gulp.parallel('sass'));
    // gulp.watch('dev/css/**/*.css', gulp.parallel('purgecss')); - удаляет media-запросы сетки 
    gulp.watch('dev/js/**/*.js', gulp.parallel('js'));
    gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('sass', 'js', /* 'purgecss' */, 'browser-sync', 'serve'));