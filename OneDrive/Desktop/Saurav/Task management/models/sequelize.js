// sequelize.js

import Sequelize from 'sequelize';
// Replace with your database credentials
const sequelize = new Sequelize('taskmanagement', 'root', '12331233', {
  host: 'localhost',
  dialect: 'mysql'
});

export default sequelize;
