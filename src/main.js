const request = require('request')
const https = require('https')
const cheerio = require('cheerio')
const fs = require('fs')
const schedule = require('node-schedule')
const moment = require('moment')
const domain = 'https://github.com/'
const userId = 'sakurasuki'
//写入日志
const genLogData = msg => `[${moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss')}] ------ ${msg}\n`
const writeLog = msg => {
  //创建可写流
  const log = fs.createWriteStream(`../logs/${moment(new Date().getTime()).format('YYYY-MM-DD')}.txt`, { flags: 'a' })
  //写入数据到流
  log.write(genLogData(msg))
  //关闭写入流，表明已没有数据要被写入可写流
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
    else writeLog('没有找到所需图片')
  })
}

//保存图片
const saveImage = (url, fileName) => {
  const path = '../'
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

//定时器规则
let rule = new schedule.RecurrenceRule()

// rule.hour = Array.from({ length: 24 }, (_, i) => 1 + i) // 每小时执行一次
//   rule.minute = [53, 54, 55]//分钟
rule.second = [30, 60] //秒
//启动任务
const job = schedule.scheduleJob(rule, () => {
  writeLog('定时任务启动')
  loadPage()
})
