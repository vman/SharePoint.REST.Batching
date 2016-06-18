/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var spsave = require('gulp-spsave');

//Create a config.js file at the same level as the gulpfile. 
var config = require('./config');

gulp.task('upload-to-sp', function () {
    gulp.src(["./Scripts/*.js"]/*, "./home.html"]*/)
      .pipe(spsave({
          username: config.username,
          password: config.password,
          siteUrl: config.siteUrl,
          folder: "Style Library/REST",
          checkin: false
      }));
});

gulp.task("watch-upload-to-sp", function () {
    gulp.watch(["./Scripts/*.js"]/*, "./home.html"]*/, ['upload-to-sp']);
})