'use strict';

var gulp = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    concat = require('gulp-concat'),
    reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    vendor: {
        js: [
        ],
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.css',
        ],
        fonts: [
        ]
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: 'src/js/**/*.js',//В стилях и скриптах нам понадобятся только main файлы
        style: 'src/css/*.scss',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/css/**/*.*ss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 8880,
    logPrefix: "login"
};

function vendorJs(cb) {
    gulp.src(path.vendor.js)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js));
    cb();
}

function vendorCss(cb) {
    gulp.src(path.vendor.css)
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.css'))
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css));
    cb();
}

function vendorFonts(cb) {
    gulp.src(path.vendor.fonts)
        .pipe(gulp.dest(path.build.fonts));
    cb();
}

exports.vendor = gulp.parallel(vendorCss/*, vendorJs, vendorFonts*/);

function buildHtml(cb) {
    gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
        .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
    cb();
}

function buildJs(cb) {
    gulp.src(path.src.js) //Найдем наш main файл
        .pipe(sourcemaps.init()) //Инициализируем sourcemap
        .pipe(uglify()) //Сожмем наш js
        .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
        .pipe(reload({stream: true})); //И перезагрузим сервер
    cb();
}

function buildCss(cb) {
    gulp.src(path.src.style) //Выберем наш main.scss
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass()) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css)) //И в build
        .pipe(reload({stream: true}))
        .on('error', sass.logError);
    cb();
}

function buildImg(cb) {
    gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        .pipe(reload({stream: true}));
    cb();
}

function buildFonts(cb) {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
    cb();
}

function webserver(cb) {
    browserSync(config);
    cb();
}

exports.clean = function (cb) {
    rimraf(path.clean, cb);
    cb();
};

exports.build = gulp.parallel(buildHtml, buildJs, buildCss, buildFonts, buildImg, exports.vendor);

exports.default = function(cb) {
    gulp.series(gulp.parallel(exports.bild, webserver)/*, watch*/);
    cb();
};
