try {
  const request = require('request')
  const https = require('https')
  const cheerio = require('cheerio')
  const fs = require('fs')
  const moment = require('moment')
  const schedule = require('node-schedule') //定时任务
  const domain = 'https://github.com/'
  const userId = 'sakurasuki'
  //写入日志
  const genLogData = msg => `[${moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')}] ------ ${msg}\n`
  const writeLog = msg => {
    const log = fs.createWriteStream('log.txt', { flags: 'a' })
    log.write(genLogData(msg))
    log.end()
  }
  writeLog(`开始读取网页信息:${domain + userId}`)
  //获取页面信息
  const loadPage = () => {
    request(domain + userId, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }

      $ = cheerio.load(body)
      //获取到页面头像的dom图片地址
      const avatar = $('.avatar.avatar-user.width-full.color-bg-default').attr('src')
      if (avatar) saveImage(avatar, 'image/avatar.png')
    })
  }

  //保存图片
  const saveImage = (url, path) => {
    https.get(url, (req, res) => {
      var imgData = ''
      req.on('data', chunk => {
        imgData += chunk
      })
      req.setEncoding('binary')
      req.on('end', () => {
        fs.writeFile(path, imgData, 'binary', err => {
          if (err) {
            console.error(err)
            writeLog(`运行失败:${err.message}`)
            return
          }
          writeLog(`保存图片成功:${path}`)
        })
      })
    })
  }

  //定时器规则
  let rule = new schedule.RecurrenceRule()
  rule.hour = [0, 4, 8, 12, 16, 20] // 每隔4小时执行一次

  //启动任务
  const job = schedule.scheduleJob(rule, () => {
    loadPage()
  })
  //停止任务
  //   job.cancel()
} catch (error) {
  writeLog(error.message)
}
