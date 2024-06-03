const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  dialectOptions: {
    socketPath: process.env.DB_HOST // Ini penting untuk koneksi ke Cloud SQL menggunakan Unix socket
  },
  logging: false // Nonaktifkan logging jika tidak diperlukan
});

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err));

module.exports = sequelize;
