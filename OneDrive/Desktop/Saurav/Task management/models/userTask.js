import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './user.js';
import Task from './task.js'

const UserTask = sequelize.define('UserTask', {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'user_id',
      },
    },
    task_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Task,
        key: 'task_id',
      },
    },
    // Optional additional fields
  });
  
  export default UserTask;