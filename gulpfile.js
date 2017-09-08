var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('default', () =>
    gulp
        .src('src/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(gulp.dest('./dist/css'))
);
