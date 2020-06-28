const gulp = require("gulp");
const browserify = require("browserify");
const source = require('vinyl-source-stream');
const tsify = require("tsify");

gulp.task("bundle", function () {
    return browserify({
        basedir: ".",
        debug: true,
        entries: ["main.ts"],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest("dist"));
})

gulp.task("default", gulp.parallel("bundle"));
