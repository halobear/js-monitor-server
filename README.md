## js-monitor-server

js-monitor 的 node 服务

## 配合项目

- [js-monitor](https://github.com/halobear/js-monitor): @halobear/monitor 监控 sdk
- [js-monitor-admin](https://github.com/halobear/js-monitor-admin): 监控的管理后台

## 部署

- 修改 `server/constants/config.js` 中 数据库、钉钉消息配置文件
- 导入数据库表`static/halo_monitor.sql`（项目需要的数据库表导入）
- 启动服务 `npm start`
