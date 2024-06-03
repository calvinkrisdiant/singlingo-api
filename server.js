require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const sequelize = require('./config/db');

const app = express();
const port = process.env.PORT || 8080; // Sesuaikan dengan port yang diekspos di Dockerfile

app.use(bodyParser.json());
app.use('/api', authRoutes);

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
