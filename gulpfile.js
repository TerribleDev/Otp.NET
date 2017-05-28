var p = require('./package.json');
var gulp = require('gulp');
var configuration = process.env.BUILD_CONFIGURATION || 'Release';
var {restore, build, test, pack, push} = require('gulp-dotnet-cli');

gulp.task('default', ['nuget']);

gulp.task('restore', [], ()=>{

    return gulp.src('**/*.sln')
               .pipe(restore());

}, {read:false});

gulp.task('build', ['restore'], ()=>{

    return gulp.src('**/*.sln')
               .pipe(build({
                   configuration: configuration
               }));

}, {read:false});

gulp.task('test', ['build'], ()=>{

    return gulp.src('**/*UnitTests.csproj')
               .pipe(test({
                   configuration: configuration,
                   noBuild: true
                }));
                
}, {read:false});

gulp.task('nuget', ['build'], ()=>{

    return gulp.src('src/Otp.NET/Otp.NET.csproj')
               .pipe(pack({
                   version: p.version,
                   configuration: configuration
               }));

}, {read:false});

gulp.task('push', ['nuget'], ()=>{

    return gulp.src('**/*.nupkg')
               .pipe(push({
                   apiKey: process.env.NUGET_API_KEY
               }));

}, {read:false});