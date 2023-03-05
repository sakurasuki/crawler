//停止定时器
const job = require('./timer')
const { writeLog } = require('./main')
;(() => {
  writeLog('停止运行')
  console.log(job)
  job.cancel()
})()
