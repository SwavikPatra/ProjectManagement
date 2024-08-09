// models/userGroup.js
import { DataTypes } from 'sequelize';
import sequelize from './sequelize.js';
import User from './user.js';
import Group from './group.js';

const UserGroup = sequelize.define('UserGroup', {
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
    primaryKey: true,
  },
  groupId: {
    type: DataTypes.INTEGER,
    references: {
      model: Group,
      key: 'id',
    },
    primaryKey: true,
  },
});

UserGroup.belongsToMany(User, { through: UserGroup, foreignKey: 'userId' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId' });


export default UserGroup;
