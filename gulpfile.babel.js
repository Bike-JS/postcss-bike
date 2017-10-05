import gulp from 'gulp';

gulp.task('clean', () => {
  const del = require('del');
  return del(['dist/*.js']);
});

gulp.task('compile', () => {
  const babel = require('gulp-babel');
  return gulp.src('lib/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('test', () => {
  const ava = require('gulp-ava');
  return gulp.src('test.js')
  .pipe(ava({ verbose: true }))
})

gulp.task('default', (done) => {
  let runSequence = require('run-sequence');
  runSequence('clean', 'compile', 'test', done);
});