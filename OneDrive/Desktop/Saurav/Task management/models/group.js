// models/group.js
import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';

const Group = sequelize.define('Group', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creator_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'user_id',
    },
    allowNull: false,
  },
});


export default Group;
