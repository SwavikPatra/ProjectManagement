import User from './user.js';
import Group from './group.js';
import UserGroup from './userGroup.js';
import Task from './task.js';
import UserTask from './userTask.js'

// Define associations
User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId' });
Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId' });

Group.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });

User.hasMany(Task, { foreignKey: 'creator_id', as: 'createdTasks' });
User.hasMany(Task, { foreignKey: 'assignee_id', as: 'assignedTasks' });

Task.belongsTo(User, { foreignKey: 'creator_id', as: 'creator' });
Task.belongsTo(User, { foreignKey: 'assignee_id', as: 'assignee' });

User.belongsToMany(Task, { through: UserTask, foreignKey: 'user_id' });
Task.belongsToMany(User, { through: UserTask, foreignKey: 'task_id' });

Group.hasMany(Task, { foreignKey: 'group_id', as: 'tasks' });
Task.belongsTo(Group, { foreignKey: 'group_id', as: 'group' });


export  { User, Group, UserGroup, Task, UserTask };
