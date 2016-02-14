'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browserSync', function () {
	return browserSync.init({
		server: {
			baseDir: './'
		},
		port: 9000,
		open: false
	});
});

gulp.task('default', ['browserSync']);