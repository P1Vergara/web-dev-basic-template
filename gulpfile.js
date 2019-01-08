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
	del([BUILD_PATH + '/*']);
}

//
// Copy STATIC_PATH folder components to BUILD_PATH
//
const copyStatic = function (){
	// images assets workflow
	gulp.src(STATIC_PATH + '/assets/**/*.*')
	.pipe(gulp.dest(BUILD_PATH + '/assets/'))

	// libraries workflow
	gulp.src(STATIC_PATH + '/libraries/*.*')
	.pipe(gulp.dest(BUILD_PATH + '/libraries/'))
}

//
// Tasks workflow pipeline
//
const workflow = function () {
	// html workflow
	gulp.src(SOURCE_PATH + '/*.html')
		.pipe(sourcemaps.init())
		.pipe(htmlMin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/'))

	// css workflow
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

	// javascript workflow
	gulp.src(SOURCE_PATH + '/scripts/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/scripts/'))

	// php workflow
	gulp.src(SOURCE_PATH + '/*.php')
		// .pipe(sourcemaps.init())
		// .pipe(sourcemaps.write('./'))
	.pipe(gulp.dest(BUILD_PATH + '/'))
}

//
// Tasks workflow watch files
//
const watchWorkflow = function () {
	// watch all the type of files
	gulp.watch(SOURCE_PATH + '/*.html', gulp.series(workflow));
	gulp.watch(SOURCE_PATH + '/styles/*.scss', gulp.series(workflow));
	gulp.watch(SOURCE_PATH + '/scripts/*.js', gulp.series(workflow));
	gulp.watch(SOURCE_PATH + '/*.php', gulp.series(workflow));
}

//
// Start browserSync emulation http://Localhost:3000
//
const server = function () {
    let options = {
        server: {
            baseDir: BUILD_PATH
        },
        open: false /// 'true' to open a browser window, 'false' to do nothing.
    };

    browserSync(options);
}

//
// run gulp tasks
//
gulp.task('cleanBuild', gulp.series(cleanBuild));
gulp.task('workflow', gulp.series(workflow));
gulp.task('watchWorkflow', gulp.series(watchWorkflow));
gulp.task('server', gulp.series(server));
gulp.task('copyStatic', gulp.series(copyStatic));

gulp.task('default', gulp.parallel(workflow, watchWorkflow, server));