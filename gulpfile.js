/*
单页应用js构建任务
改动根目录下的js，则编译被改动的js
改动非根目录下js,vue，都只编译根目录下的app.js
 */
const gulp = require('gulp')
const replace = require('gulp-replace')
const browserSync = require('browser-sync').create()
const webpack = require('webpack')
const webpackDevConfig = require('./build/webpack.dev.conf.js')
const config = require('./config/index.js')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

let dist = './dist/'
let staticDir = './static/'
const srcFiles = {
  htmlInRoot: './src/*.html'
}
gulp.task('webserver', function () {
  browserSync.init(dist, {
    startPath: '/', // 服务器运行时打开的页面
    server: {
      baseDir: [staticDir, dist]
    },
    proxy: config.dev.proxyTable,
    reloadDebounce: 2000, // 重载事件后1秒后才允许下次重载
    port: 3000,
    ghostMode: false, // 点击，滚动和表单不要镜像到其他设备里
    codeSync: false // 不要发送任何文件改变事件给浏览器
  })
})

gulp.task('buildHtml', function () {
  return gulp.src([srcFiles.htmlInRoot], { base: './src' })
    .pipe(replace(/__replace_by_time__/g, ~~(Date.now()/10000)))
    .pipe(gulp.dest(dist))
})
