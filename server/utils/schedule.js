const schedule = require('node-schedule')
const mysql = require('./mysql')
const table = 'halo_erros'

// 每周六林凌晨5点清空10天数据
console.log('启动每周六凌晨五点 数据库10天前数据清理...')
schedule.scheduleJob('0 0 5 * * 6', async function () {
  const start = Date.now()
  console.log('执行清空数据库定时任务...')
  // 清空10天前数据库
  const days = 10
  await mysql
    .mysql(table)
    .where(mysql.mysql.raw(`date_sub(curdate(), INTERVAL ${days} DAY) > date(create_time)`))
    .del()
  console.log(`${Date.now() - start}ms 执行清空数据库定时任务完成。`)
})
