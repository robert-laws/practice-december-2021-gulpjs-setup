const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const purgecss = require('gulp-purgecss');
const autoprefixer = require('gulp-autoprefixer');
const minify = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin');
const imagewebp = require('gulp-webp');

// create functions
// sass
function compileSass() {
  return src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(purgecss({ content: ['*.html'] }))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minify())
    .pipe(dest('dist/css'));
}

// javascript
function compileJS() {
  return src('src/js/*.js').pipe(terser()).pipe(dest('dist/js'));
}

// images
function optimizeImages() {
  return src('src/img/*').pipe(imagemin()).pipe(dest('dist/images'));
}

// webp
function webpImage() {
  return src('dist/images/*.{jpg,png}')
    .pipe(imagewebp())
    .pipe(dest('dist/images'));
}

// create watch task
function watchTask() {
  watch(['src/scss/**/*.scss', '*.html'], compileSass);
  watch('src/js/*.js', compileJS);
  watch('src/images/*.{jpg,png}', optimizeImages);
  watch('dist/images/*.{jpg,png}', webpImage);
}

// default gulp
exports.default = series(
  compileSass,
  compileJS,
  optimizeImages,
  webpImage,
  watchTask
);
