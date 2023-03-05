const request = require('request')
const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')
const moment = require('moment')
const domain = 'https://github.com/'
const userId = 'sakurasuki'
//写入日志
const genLogData = msg => `[${moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')}] ------ ${msg}\n`
const writeLog = msg => {
  const log = fs.createWriteStream('../log.txt', { flags: 'a' })
  log.write(genLogData(msg))
  log.end()
}
//获取页面信息
const loadPage = () => {
  writeLog(`开始读取网页信息:${domain + userId}`)
  request(domain + userId, (error, res, body) => {
    if (error) {
      writeLog(`loadPage异常捕获：${error.message}`)
      return
    }

    $ = cheerio.load(body)
    //获取到页面头像的dom图片地址
    const avatar = $('.avatar.avatar-user.width-full.color-bg-default').attr('src')
    if (avatar) saveImage(avatar, 'avatar.png')
  })
}

//保存图片
const saveImage = (url, fileName) => {
  const path = '../../images/'
  https.get(url, (req, res) => {
    var imgData = ''
    req.on('data', chunk => {
      imgData += chunk
    })
    req.setEncoding('binary')
    req.on('end', () => {
      fs.writeFile(path + fileName, imgData, 'binary', err => {
        if (err) {
          writeLog(`保存失败:${err.message}`)
          return
        }
        writeLog(`保存图片成功:${path + fileName}`)
      })
    })
  })
}

module.exports = {
  loadPage,
  writeLog
}
