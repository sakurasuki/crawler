const schedule = require('node-schedule') //定时任务
const { loadPage, writeLog } = require('./main.js')
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
module.exports = job
