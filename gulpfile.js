'use strict';

var gulp = require('gulp');
var fs = require('fs');
var files = require('./files');

// load dependencies
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minify = require('gulp-minify-css'); //css
var uglify = require('gulp-uglify'); //js
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var webpack = require('gulp-webpack');
var del = require('del');

// release
gulp.task('default', ['release', 'config:release']);
gulp.task('release', ['release:css', 'release:js']); 

gulp.task('config:release', function() {
    var config = require('./config.json');
    config.env = 'release';
    fs.writeFileSync('config.json', JSON.stringify(config, null, 4), 'utf-8');
});

gulp.task('release:css', function() {

    //css
    return gulp.src(files.css)
            .pipe(concat(files.destCss))
            .pipe(autoprefixer({
                browsers: ['> 5%', 'last 5 version']
            })) // auto-prefix
            .pipe(gulp.dest(files.release))
            .pipe(rename({suffix:'.min'}))
            .pipe(minify())
            .pipe(gulp.dest(files.release));
});

gulp.task('release:js', function() { // add jslint and uTest later maybe

    //js
    return gulp.src(files.js)
            // .pipe(concat(files.destJs))
            .pipe(webpack(require('./webpack.config.js')))
            .pipe(gulp.dest(files.release)) 
            //js hint before uglify
            // .pipe(jshint())
            // .pipe(jshint.reporter('jshint-stylish'))
            //uglify
            .pipe(rename({suffix:'.min'}))
            .pipe(uglify())
            .pipe(gulp.dest(files.release));
});

//-----------------------------------------------> for dev

gulp.task('dev', ['concat', 'config:dev', 'watch', 'server']);
gulp.task('concat', ['concat:css', 'concat:js']);

gulp.task('config:dev', function() {
    var config = require('./config.json');
    config.env = 'dev';
    fs.writeFileSync('config.json', JSON.stringify(config, null, 4), 'utf-8');
});

gulp.task('server', function() {

    return nodemon({
            ignore: files.monignore,
            ext: "js"
        });
});

// concat css
gulp.task('concat:css', function() {

    return gulp.src(files.css)
            .pipe(concat(files.destCss))
            .pipe(gulp.dest(files.release))
            .pipe(livereload());
});

// concat js
gulp.task('concat:js', function() {

    return gulp.src(files.js)
            .pipe(webpack(require('./webpack.config.js')))
            .pipe(gulp.dest(files.release))
            .pipe(livereload());
});

gulp.task('reloadView', function() {

    //views
    return gulp.src(files.views)
            .pipe(livereload());
});

gulp.task('watch', function() {

    livereload.listen();

    gulp.watch(files.js, ['concat:js']);
    gulp.watch(files.css, ['concat:css']);
    gulp.watch(files.views, ['reloadView']);
});
