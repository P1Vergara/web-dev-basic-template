'use strict';

//
// Gulp extensions
//
const del = require('del'),
	gulp = require('gulp'),
	sass = require('gulp-sass'),
	cssnano = require('gulp-cssnano'),
	htmlMin = require('gulp-htmlmin'),
	uglify = require('gulp-uglify'),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync');

//
// Folders references
//
const BUILD_PATH = './build',
	SOURCE_PATH = './src',
	STATIC_PATH = './static';

//
// Manually clean build folder
//
const cleanBuild = function () {
	return del([BUILD_PATH + '/*']);
}

//
// Tasks workflow pipeline
//
// html workflow
const html = function() {
	return gulp.src(SOURCE_PATH + '/*.html')
		.pipe(sourcemaps.init())
		.pipe(htmlMin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/'))
}

// css workflow
const scss = function () {
	return gulp.src(SOURCE_PATH + '/styles/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
		  	overrideBrowserslist: ['last 2 versions'],
		  	cascade: false
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/styles/'))
}

// javascript workflow
const js = function () {
	return	gulp.src(SOURCE_PATH + '/scripts/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/scripts/'))
}

// php workflow
const php = function () {
	return	gulp.src(SOURCE_PATH + '/*.php')
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/'))
}

//
// STATIC_PATH folder components to BUILD_PATH
//
// assets files
const assets = function () {
	return gulp.src(STATIC_PATH + '/assets/**/*.*')
	.pipe(gulp.dest(BUILD_PATH + '/assets/'))
}

// libraries files
const libraries = function () {
	return gulp.src(STATIC_PATH + '/libraries/*.*')
	.pipe(gulp.dest(BUILD_PATH + '/libraries/'))
}

//
// Tasks workflow watch files
//
const watchFiles = function () {
	// watch all the type of files
	gulp.watch(SOURCE_PATH + '/*.html', html);
	gulp.watch(SOURCE_PATH + '/styles/*.scss', scss);
	gulp.watch(SOURCE_PATH + '/scripts/*.js', js);
	gulp.watch(SOURCE_PATH + '/*.php', php);

	gulp.watch(STATIC_PATH + '/assets/**/*.*', assets);
	gulp.watch(STATIC_PATH + '/libraries/*.*', libraries);

	gulp.series(browserSyncReload);
}

//
// Start browserSync at http://Localhost:3000
//
const serve = function (done) {
    let options = {
        server: {
            baseDir: BUILD_PATH
		},
		port: 3000,
        open: false /// 'true' to open a browser window, 'false' to do nothing.
    };

	browserSync(options);
	done();
}

//
// Browsersync reload
//
const browserSyncReload = function (done) {
	browserSync.reload();
	done();
}


//
// Complex tasks
//
const build = gulp.series(cleanBuild, gulp.parallel(html, scss, js, php, assets, libraries));
const watch = gulp.parallel(watchFiles, serve);

//
// Export tasks
//
exports.html = html;
exports.scss = scss;
exports.js = js;
exports.php = php;
exports.assets = assets;
exports.libraries = libraries;
exports.cleanBuild = cleanBuild;
exports.build = build;
exports.watch = watch;
exports.default = build;