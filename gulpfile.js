//подключаем модули галпа
const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

// const CSS_SRC = [
//   './src/sass/reset.scss',
//   './src/sass/styles.scss',
//   './src/sass/max-540.scss',
//   './src/sass/max-730.scss',
//   './src/sass/max-1000.scss'
// ];

const CSS_SRC = [
  './src/sass/reset.scss',
  './src/sass/header.scss',
  './src/sass/maincontent.scss',
  './src/sass/howcanwehelp.scss',
  './src/sass/slider.scss',
  './src/sass/footer.scss'
];

const JS_SRC = './src/js/*';
const CSS_DEST = './build/css';
const JS_DEST = './build/js'

const LEVEL = 2;

gulp.task('transpilationСSS', function(){
  return gulp.src(CSS_SRC)
    .pipe(concat('all.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(CSS_DEST))
});

gulp.task('transpilationСSSwithMinifacation', function(){
  return gulp.src(CSS_SRC)
   .pipe(concat('all.css'))
   .pipe(sass().on('error', sass.logError))
   .pipe(autoprefixer({
     overrideBrowserslist: ['last 2 versions'],
     cascade: false
   }))
   .pipe(cleanCSS({
     level: LEVEL
   }))
   .pipe(gulp.dest(CSS_DEST))
});

gulp.task('transpilationJS', function(){
  return gulp.src(JS_SRC)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(JS_DEST))
});

gulp.task('transpilationJSwithMinifacation', function(){
  return gulp.src(JS_SRC)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(minify())
    .pipe(gulp.dest(JS_DEST))
});

gulp.task('hotReload', function(){
  browserSync.init({
    server: "./"
  });
  gulp.watch("./build").on('change', browserSync.reload);
  gulp.watch("./index.html").on('change', browserSync.reload);

  CSS_SRC.forEach(function(hrefdir){
    gulp.watch(hrefdir).on('change', function(){
        gulp.src(CSS_SRC)
        .pipe(concat('all.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
          overrideBrowserslist: ['last 2 versions'],
          cascade: false
        }))
        .pipe(gulp.dest(CSS_DEST));
    });
  });

  gulp.watch('./src/sass/reset.scss').on('change', browserSync.reload);
  gulp.watch('./src/sass/header.scss').on('change', browserSync.reload);
  gulp.watch('./src/sass/maincontent.scss').on('change', browserSync.reload);
  gulp.watch('./src/sass/howcanwehelp.scss').on('change', browserSync.reload);
  gulp.watch('./src/sass/slider.scss').on('change', browserSync.reload);
  gulp.watch('./src/sass/footer.scss').on('change', browserSync.reload);
});

gulp.task('compress', function() {
  gulp.src('./src/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('./build/img'));
  gulp.watch('./build/img').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series(
  'transpilationСSS',
  'transpilationJS',
  gulp.parallel('compress', 'hotReload')
));

gulp.task('prod', gulp.series(
  'transpilationСSSwithMinifacation',
  'transpilationJSwithMinifacation',
  'compress'
));
