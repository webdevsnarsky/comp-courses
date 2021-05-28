'use strict';

let gulp = require('gulp');
let sass = require('gulp-sass');
let csso = require('gulp-csso');
let rename = require("gulp-rename");
let gcmq = require('gulp-group-css-media-queries');
let sourcemaps = require("gulp-sourcemaps");
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const include = require('gulp-include');
sass.compiler = require('node-sass');
const webpack = require('webpack-stream');
const del = require('del');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');

gulp.task('img', function (){
  return gulp.src(['.src/assets/img/**/*'])
  // .pipe(newer('./dist'))
  .pipe((imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]
    })
  ])))
  .pipe(gulp.dest('./dist/assets/img'))
  // .pipe(browserSync.stream())
  
});

gulp.task('sass', function (){
    return gulp.src('./src/assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(gcmq())
    .pipe(csso())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./src/assets/css'))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('js', function (){
    return gulp.src(['./src/assets/js/*.js', '!src/assets/js/*.min.js'])
		.pipe(webpack({
			mode: 'production',
			performance: { hints: false },
			module: {
				rules: [
					{
						test: /\.(js)$/,
						exclude: /(node_modules)/,
						loader: 'babel-loader',
						query: {
							presets: ['@babel/env'],
							plugins: ['babel-plugin-root-import']
						}
					}
				]
			}
		})).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(rename('script.min.js'))
		.pipe(gulp.dest('./src/assets/js/'))
		.pipe(browserSync.stream())
});

gulp.task('html', function (){
    return gulp.src('./src/*.html')
    .pipe(include())
    .on('error', console.log)
    .pipe(gulp.dest('./src/'))
    .pipe(browserSync.reload({ stream: true }));
});


gulp.task('clean', async function() {
  return del.sync('./dist')

});

gulp.task('prebuild', async function() {
  let buildCss = gulp.src('./src/assets/css/*.css').pipe(gulp.dest('./dist/assets/css'));

  let buildFonts = gulp.src('./src/assets/fonts/**/*').pipe(gulp.dest('./dist/assets/fonts'));

  // let buildImages = gulp.src('.src/assets/img/**/*').pipe(imagemin()).pipe(gulp.dest('./dist/assets/img'))

  let buildJs =  gulp.src('./src/assets/js/*.min.js').pipe(gulp.dest('./dist/assets/js'));

  let buildStructure =  gulp.src(['./src/*.html']).pipe(gulp.dest('./dist'));
});

gulp.task('serve', function() {
    browserSync.init({
        server: './src', 
        // tunnel: 'abc',
        port: 3000
    }, 
    );

    gulp.watch('./src/assets/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/*.html').on('change', browserSync.reload);
    gulp.watch(['./src/assets/js/*.js', '!src/assets/js/*.min.js'], gulp.parallel('js'));
    gulp.watch('./src/view/**/*.html',  gulp.parallel('html'));
});


gulp.task('start', gulp.parallel('html', 'sass', 'js', 'serve'));

gulp.task('build', gulp.series('clean', gulp.parallel('sass', 'js', 'img'), 'prebuild'));