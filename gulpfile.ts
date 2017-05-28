"use strict";

/**
 * Packages.
 */
const gulp = require("gulp");
const del = require("del");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const tsc = require("gulp-typescript");
const tslint = require("gulp-tslint");
const runSequence = require("run-sequence");
const browserSync = require("browser-sync");
const reload = browserSync.reload;

/**
 * Configuration.
 */
const DIST_DIR = "dist";

const TMP_DIR = ".tmp";
const TMP_SCRIPTS_DIR = ".tmp/scripts";

const tsProject = tsc.createProject("tsconfig.json");

/**
 * Clean task.
 */
gulp.task("clean", (x) => del([DIST_DIR, TMP_DIR], x));

/**
 * Lint ts.
 */
gulp.task("lint", () => {
  return gulp.src("app/**/**.ts")
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report());
});

/**
 * Compile task for ts.
 */
gulp.task("compile", ["lint"], () => {
  // source files
  let tsResult = gulp.src([
    "app/**/!(init)*.ts",
    "app/init.ts",
  ]).pipe(tsProject());

  // tipos typescript
  tsResult.dts
    .pipe(concat("index.d.ts"))
    .pipe(gulp.dest(DIST_DIR));

  // compilado javascript
  return tsResult.js
    .pipe(concat("of-config.js"))
    .pipe(gulp.dest(DIST_DIR))
    .pipe(gulp.dest(TMP_SCRIPTS_DIR))
    .pipe(rename("of-config.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest(DIST_DIR))
    .pipe(gulp.dest(TMP_SCRIPTS_DIR));
});

/**
 * Content task.
 */
gulp.task("content", () => {
  return gulp.src([
    "app/**/*",
    "!**/*.html",
    "!**/*.ts",
    "!**/*.scss",
  ], { nodir: true })
    .pipe(gulp.dest(TMP_DIR));
});

/**
 * Libs task.
 */
gulp.task("libs", () => {
  return gulp.src([
    "node_modules/angular/angular.min.js",
    "node_modules/angular-translate/dist/angular-translate.min.js",
    "node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js",
  ], { nodir: true })
    .pipe(gulp.dest(TMP_SCRIPTS_DIR))
    .pipe(gulp.dest(DIST_DIR));
});

/**
 * Build task.
 */
gulp.task("build", (callback) => {
  runSequence("clean", ["compile", "content", "libs"], callback);
});

/**
 * Watch task.
 */
gulp.task("serve", ["compile", "content", "libs"], () => {
  browserSync({
    // Customize the Browsersync console logging prefix
    logPrefix: "OFK",
    notify: false,
    port: 3001,
    // Allow scroll syncing across breakpoints
    // scrollElementMapping: ["main", ".mdl-layout"],
    // Run as an https by uncommenting "https: true"
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: [TMP_DIR, "app"],
  });

  gulp.watch(["app/**/*.{html,json}"], reload);
  gulp.watch(["app/**/*.{js,ts}"], ["compile", reload]);
});
