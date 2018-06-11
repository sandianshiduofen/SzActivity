/*var gulp = require('gulp');
var imageMin = require('gulp-imagemin');
// js压缩
var uglify = require('gulp-uglify');
// css压缩
var cleanCSS = require('gulp-clean-css');

// 移动html
gulp.task('copy',  function() {
  return gulp.src('./src/*.html')
    .pipe(gulp.dest(destDir))
});


// js压缩
gulp.task('jscompress', function() {
    // 1. 找到文件
    gulp.src('./src/js/*.js')
    // 2. 压缩文件
        .pipe(uglify({ mangle: false }))
    // 3. 另存压缩后的文件
        .pipe(gulp.dest('./activity/jxs/campaign/js'))
})

// css压缩
gulp.task('csscompress', function() {
  return  gulp.src('./src/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('./activity/jxs/campaign/css'));
});

gulp.task('default',['jscompress','csscompress'])

// 监听
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch('./src/js/*.js', ['jscompress']);
    gulp.watch('./src/css/*.css', ['csscompress']);
});
*/


var gulp = require('gulp'),//基础库
    htmlmin = require('gulp-htmlmin'),//html压缩
    cssmin = require('gulp-minify-css'),//css压缩
    jshint = require('gulp-jshint'),//js检查
    uglify = require('gulp-uglify'),//js压缩
    imagemin = require('gulp-imagemin'),//图片压缩
    pngquant = require('imagemin-pngquant'),//图片深入压缩
    imageminOptipng = require('imagemin-optipng'),
    imageminSvgo = require('imagemin-svgo'),
    imageminGifsicle = require('imagemin-gifsicle'),
    imageminJpegtran = require('imagemin-jpegtran'),
    domSrc = require('gulp-dom-src'),
    cheerio = require('gulp-cheerio'),
    processhtml = require('gulp-processhtml'),
    Replace = require('gulp-replace'),
    cache = require('gulp-cache'),//图片压缩缓存
    clean = require('gulp-clean'),//清空文件夹
    conCat = require('gulp-concat'),//文件合并
    plumber=require('gulp-plumber'),//检测错误
    gutil=require('gulp-util');//如果有自定义方法，会用到
     
 
var date = new Date().getTime();
 
// gulp.task('clean',function(){
//     return gulp.src('./activity/jxs/campaign/**',{read:false})
//         .pipe(clean());
// });
function errrHandler( e ){
    // 控制台发声,错误时beep一下
    gutil.beep();
    gutil.log(e);
    this.emit('end');
}
 
gulp.task('cleanCash', function (done) {//清除缓存
    return cache.clearAll(done);
});
// 本地开始
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['src/*.html'])  //'index/*.htm' 
        .pipe(plumber({errorHandler:errrHandler}))     
        // .pipe(Replace(/_VERSION_/gi, date))
        .pipe(processhtml())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./activity/jxs/campaign'));
});
gulp.task('cssmin', function(){
    gulp.src(['src/css/*.css'])
        // .pipe(conCat('css/index.min.css'))
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('./activity/jxs/campaign/css'));
});
gulp.task('jsmin', function () {
    gulp.src(['src/js/*.js'])
        // .pipe(conCat('js/index.min.js'))
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(uglify({ mangle: false }))
        /*.pipe(uglify({
            //mangle: {except: ['require' ,'exports' ,'module' ,'$']},//类型：Boolean 默认：true 是否修改变量名
            // mangle:
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'false' //保留所有注释
        }))*/
        .pipe(gulp.dest('./activity/jxs/campaign/js'));
});
gulp.task('imagemin', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(cache(imagemin({     
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片          
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant(),imageminJpegtran({progressive: true})
            , imageminGifsicle({interlaced: true}),imageminOptipng({optimizationLevel:3}), imageminSvgo()] //使用pngquant深度压缩png图片的imagemin插件          
        })))
        .pipe(gulp.dest('./activity/jxs/campaign/images'));
});

/*本地开始结束*/
/*准生产开始*/
gulp.task('phtmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: false,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: false,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(['src/*.html'])  //'index/*.htm' 
        .pipe(plumber({errorHandler:errrHandler}))     
        // .pipe(Replace(/_VERSION_/gi, date))
        .pipe(processhtml())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./activityweb/jxs/campaign'));
});
gulp.task('pcssmin', function(){
    gulp.src(['src/css/*.css'])
        // .pipe(conCat('css/index.min.css'))
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(cssmin({
            advanced: false,//类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: 'ie7',//保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: false,//类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
            //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('./activityweb/jxs/campaign/css'));
});
gulp.task('pjsmin', function () {
    gulp.src(['src/js/*.js'])
        // .pipe(conCat('js/index.min.js'))
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(uglify({ mangle: false }))
        /*.pipe(uglify({
            //mangle: {except: ['require' ,'exports' ,'module' ,'$']},//类型：Boolean 默认：true 是否修改变量名
            // mangle:
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'false' //保留所有注释
        }))*/
        .pipe(gulp.dest('./activityweb/jxs/campaign/js'));
});
gulp.task('pimagemin', function () {
    gulp.src('src/images/*.{png,jpg,gif,ico}')
        .pipe(plumber({errorHandler:errrHandler}))
        .pipe(cache(imagemin({     
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片          
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant(),imageminJpegtran({progressive: true})
            , imageminGifsicle({interlaced: true}),imageminOptipng({optimizationLevel:3}), imageminSvgo()] //使用pngquant深度压缩png图片的imagemin插件          
        })))
        .pipe(gulp.dest('./activityweb/jxs/campaign/images'));
});
/*准生产结束*/

//本地
gulp.task('default',['cssmin','htmlmin','jsmin','imagemin']);

//准生产
gulp.task('p',['pcssmin','phtmlmin','pjsmin','pimagemin']);

// 本地
gulp.task('watch',function(){
    gulp.watch('src/*.html', ['htmlmin']);
    gulp.watch('src/css/*.css', ['cssmin']);
    gulp.watch('src/js/*.js', ['jsmin']);
    gulp.watch('src/images/*.{png,jpg,gif,ico}', ['imagemin']);
});
// 准生产
gulp.task('pwatch',function(){
    gulp.watch('src/*.html', ['phtmlmin']);
    gulp.watch('src/css/*.css', ['pcssmin']);
    gulp.watch('src/js/*.js', ['pjsmin']);
    gulp.watch('src/images/*.{png,jpg,gif,ico}', ['pimagemin']);
});

