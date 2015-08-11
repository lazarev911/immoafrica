'use strict';

var gulp        =   require('./node_modules/gulp'),
	concat      =   require('./node_modules/gulp-concat'),
	uglify      =   require('./node_modules/gulp-uglify'),
	watch       =   require('./node_modules/gulp-watch'),

	cssmin      =   require('gulp-minify-css'),
	prefixer    =   require('./node_modules/gulp-autoprefixer'),
	sourcemaps  =   require('./node_modules/gulp-sourcemaps'),
	sass        =   require('./node_modules/gulp-sass'),
	browserSync =   require("browser-sync"),
	reload      =   browserSync.reload;

/**
 *  Js
 */
gulp.task('js', function () {
	gulp.src([
				'bower_components/jquery/dist/jquery.min.js',
				'bower_components/foundation/js/foundation.js',
				'js/app.js'
			])
		.pipe(sourcemaps.init())
		.pipe(concat('js/main.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('.'))
});

/**
 *  Watch
 */
gulp.task('watch', ['js'], function () {
	gulp.watch('web/js/** web/*.js', ['js'])
});

/**
 * Style
 */
gulp.task('style', function () {
	gulp.src('scss/app.scss') //Выберем наш main.scss
		.pipe(sourcemaps.init()) //То же самое что и с js
		.pipe(sass()) //Скомпилируем
		.pipe(prefixer()) //Добавим вендорные префиксы
		.pipe(cssmin()) //Сожмем
		.pipe(concat('main.min.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('css')) //И в build
		.pipe(reload({stream: true}));
});