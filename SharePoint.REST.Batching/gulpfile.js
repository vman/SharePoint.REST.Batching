/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var spsave = require('gulp-spsave');
var config = require('config');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('upload-to-sp', function () {
    gulp.src(["./Scripts/*.js"]/*, "./home.html"]*/)
      .pipe(spsave({
          username: config.username,
          password: config.password,
          siteUrl: config.siteUrl,
          folder: "Style Library",
          checkin: false
      }));
});

gulp.task("watch-upload-to-sp", function () {
    gulp.watch(["./Scripts/*.js"]/*, "./home.html"]*/, ['upload-to-sp']);
})