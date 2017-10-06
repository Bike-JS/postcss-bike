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

gulp.task('lint', () => {
  const eslint = require('gulp-eslint');
  return gulp.src(['lib/*.js','!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
})

gulp.task('test', () => {
  const ava = require('gulp-ava');
  return gulp.src('test.js')
  .pipe(ava({ verbose: true }));
})

gulp.task('default', ['lint'], (done) => {
  let runSequence = require('run-sequence');
  runSequence('clean', 'compile', 'test', done);
});