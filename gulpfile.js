var path = require('path'),
    gulp = require('gulp'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename');

gulp.task('babel-node', function() {
  return gulp.src(['!node_modules/', '**/*.6.js'])
    .pipe(babel())
    .pipe(rename({suffix: '.babel'}))
    .pipe(gulp.dest(''));
});

gulp.task('watch-node', function() {
  gulp.watch(['!node_modules/', '**/*.6.js'], ['babel-node']);
});

gulp.task('default', function() {
  gulp.start('watch-node');
});
