/**
 *
 * yassghn.neocities.org
 *
 * gulpfile.js
 *
 */

import { deleteAsync } from 'del'
import gulp from 'gulp'
import gulpsass from 'gulp-sass'
import cleancss from 'gulp-clean-css'
import autoprefixer from 'gulp-autoprefixer'
import replace from 'gulp-replace'
import * as sassc from 'sass'
import polka from 'polka'
import path from 'path'
import servestatic from 'serve-static'
import { fileURLToPath } from 'url';

'use strict';

// config
const config = {
    dirs: {
        dist: './dist',
        css: './dist/css',
        js: './dist/js',
        fonts: './dist/fonts'
    },
    src: {
        sass: './src/sass/**/*.scss',
        html: './src/**/*.html',
        js: './src/js/**/*.js',
        animatelo: './node_modules/animatelo/dist/animatelo.min.js'
    }
}

// polka config
const polkaConfig = {
    dir: path.join(path.dirname(fileURLToPath(import.meta.url)), config.dirs.dist),
    port: 3000
}

// init sass compiler
const sass = gulpsass(sassc)

// build sass
gulp.task('sass:build', function () {
    return gulp.src(config.src.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 3 version'))
        .pipe(cleancss())
        .pipe(gulp.dest(config.dirs.css))
})

// watch sass
gulp.task('sass:watch', function () {
    gulp.watch(config.src.sass, gulp.task('sass:build'))
})

// copy html
gulp.task('html:copy', function () {
    return gulp.src(config.src.html)
        .pipe(gulp.dest(config.dirs.dist))
})

// watch html
gulp.task('html:watch', function () {
    gulp.watch(config.src.html, gulp.task('html:copy'))
})

gulp.task('js:copy', function () {
    return gulp.src(config.src.js)
        .pipe(gulp.dest(config.dirs.js))
})

// watch js
gulp.task('js:watch', function () {
    gulp.watch(config.src.js, gulp.task('js:copy'))
})

// clean
gulp.task('clean', async function () {
    return await deleteAsync([config.dirs.dist])
})

// run polka server
gulp.task('polka:serve', function () {
    return polka().use(servestatic(polkaConfig.dir))
        .listen(polkaConfig.port, () => {
            console.log(`serving on localhost:${polkaConfig.port}`)
        })
})

// copy scripts
gulp.task('scripts:copy', function() {
    return gulp.src(config.src.animatelo)
        .pipe(gulp.dest(config.dirs.js))
})

// serve
gulp.task('serve', gulp.task('polka:serve'))

// build
gulp.task('build', gulp.parallel('sass:build', 'js:copy', 'html:copy', 'scripts:copy'))

// watch
gulp.task('watch', gulp.parallel('sass:watch', 'js:watch', 'html:watch', 'polka:serve'))

// default task
gulp.task('default', gulp.task('build'))