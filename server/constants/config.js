const config = {
  secretKey: 'halo_monitor',
  mysql: {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'halo_monitor',
  },
  ding: {
    access_token: 'addc88e7fdd25f7757b2afe31ca029c1c4f995511831fd195d72619db486e0b6',
    secret: 'SEC66666e1dd75f6ed3d24b481da985e82509df4acec8da2dea523a2895c4e90805',
  },
  port: 9601,
}

module.exports = config
