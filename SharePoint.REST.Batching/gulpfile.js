/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var spsave = require('gulp-spsave');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('upload-to-sp', function () {
    gulp.src(["./Scripts/*.js"]/*, "./home.html"]*/)
      .pipe(spsave({
          username: "ccdev2@murphyccdev.onmicrosoft.com",
          password: "Surf1ng_",
          siteUrl: "https://murphyccdev.sharepoint.com/sites/pub/",
          folder: "Style Library/REST",
          checkin: false
      }));
});

gulp.task("watch-upload-to-sp", function () {
    gulp.watch(["./Scripts/*.js"]/*, "./home.html"]*/, ['upload-to-sp']);
})