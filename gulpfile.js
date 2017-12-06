'use strict';

//
// Gulp extensions
//
var gulp = require('gulp');
var path = require('path');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');

//
// Folders references
//
var BUILD_PATH = './build';
var SOURCE_PATH = './src';
var STATIC_PATH = './static';

//
// Copy STATIC_PATH folder components to BUILD_PATH
//
function copyStatic(){
	/// images assets workflow
	gulp.src(STATIC_PATH + '/assets/**/*.*')
	.pipe(gulp.dest(BUILD_PATH + '/assets/'))

	/// resources workflow
	gulp.src(STATIC_PATH + '/libraries/**/*.*')
	.pipe(gulp.dest(BUILD_PATH + '/libraries/'))
}

//
// Workflow pipeline for the SOURCE_PATH files
//
function workflow() {
	/// html workflow
	gulp.src(SOURCE_PATH + '/*.html')
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/'))

	/// css workflow
	gulp.src(SOURCE_PATH + '/styles/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
		  browsers: ['last 2 versions'],
		  cascade: false
		}))
		.pipe(cssnano())
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/styles/'))

	/// javascript workflow
	gulp.src(SOURCE_PATH + '/scripts/*.js')
		.pipe(sourcemaps.init())
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/scripts/'))
}

//
// Watch workflows
//
function watchWorkflow() {
	/// watch all the type of files
	gulp.watch(SOURCE_PATH + '/*.html', ['workflow']);
	gulp.watch(SOURCE_PATH + '/styles/*.scss', ['workflow']);
	gulp.watch(SOURCE_PATH + '/scripts/*.js', ['workflow']);
}

//
// Start browserSync at Localhost:8000
//
function server() {
    var options = {
		ui: {
			port: 8000
		},
        server: {
            baseDir: BUILD_PATH
        },
        open: false /// 'true' to open a browser window, 'false' to do nothing.
    };

    browserSync(options);
}

//
// Run gulp tasks
//
gulp.task('workflow', workflow);
gulp.task('watchWorkflow', watchWorkflow);
gulp.task('server', server);
gulp.task('copyStatic', copyStatic);
gulp.task('default', ['workflow', 'watchWorkflow', 'server']);