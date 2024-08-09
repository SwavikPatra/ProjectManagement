import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'; 

import { User, Group, UserGroup, Task, UserTask } from '../models/associations.js';

import sequelize from '../models/sequelize.js';

const router = express.Router();
router.use(express.json());

router.use(cookieParser());

const jwtSecret = '9a3e78bde3b7c3a6a9b3a7d9f3c8b7d6e3a6a9b3c7d9e3f6a9b3c7d9e3b6a9d';

router.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Middleware to verify the token and get the user ID
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token){
      console.log('inside verify token, token is not there')
      return res.sendStatus(403);
    }
    
    try {
      const decodedToken = jwt.verify(token, jwtSecret);
      console.log(`token decoded`)
      req.user_id = decodedToken.id;
      console.log(`token user id id ${decodedToken.id}`)
      // console.log(`user id is : ${req.user_id}`)
    } catch (error) {
      console.log('not able to decode the token')
      res.sendStatus(403);
    }
    next();
  };

router.post('/create-group', verifyToken, async (req, res) => {
  const { name, userIds } = req.body;
  console.log(`inside create group backend`)
  try {
    const group = await Group.create({ 
      name : name,
      creator_id : req.user_id,
     });

    if (userIds && userIds.length > 0) {

      // Find all users with the specified user IDs
      const users = await User.findAll({
        where: {
          user_id: userIds,
        },
      });

      if (users.length > 0) {
        console.log('Found users:', users.map(user => user.toJSON()));

        // Create user groups
        const userGroups = users.map((user) => ({
          userId: user.user_id,
          groupId: group.id,
        }));

        await UserGroup.bulkCreate(userGroups);
        console.log('User groups created:', userGroups);
      } else {
        console.log('No users found with the specified IDs');
      }
    }

    res.status(201).json({ message: 'Group created successfully', group });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// #############################################################################
router.get('/user-groups', verifyToken,  async (req, res) => {
  
    try {
      const userId = req.user_id;
    //   Query user groups based on userId
      // First, find all groupIds for the user
    const userGroups = await UserGroup.findAll({ where: { userId } });
    const groupIds = userGroups.map(userGroup => userGroup.groupId);

    // Then, find all groups with these groupIds
    const groups = await Group.findAll({ where: { id: groupIds } });
  
      res.status(200).json(groups);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Get tasks assigned to the user
router.get('/user-tasks', verifyToken, async (req, res) => {
  try {
    const userId = req.user_id; // Assuming req.user contains the authenticated user's info
    const tasks = await Task.findAll({
      where: { assignee_id: userId, status: 'Pending' },
      include: [{ model: User, as: 'assignee' }]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//   #########################################################

router.get('/group-view/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user_id;
    const groupId = req.params.id;

    // Fetch the group details
    const group = await Group.findOne({
      where: { id: groupId },
    });

    // Fetch the user groups
    const userGroups = await UserGroup.findAll({
      where: { groupId },
    });

    // Extract user IDs from user groups
    const userIds = userGroups.map(ug => ug.userId);

    // Fetch the members of the group
    const members = await User.findAll({
      where: {
        user_id: userIds,
      },
    });

    // Fetch the tasks associated with the group
    const tasks = await Task.findAll({
      where: { group_id: groupId },
    });

    // Send the response with group details, members, and tasks
    res.json({ group, members, tasks, userId});
  } catch (error) {
    console.error('Error fetching group info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


  // Create a new task
router.post('/group-view/:id/create-task', async (req, res) => {
  const groupId = req.params.id;
    console.log('inside create task backend')
    const { title, assigneeId, dueDate, priority, description } = req.body;
    console.log(`inside create-task ${title}, ${assigneeId}, ${dueDate}, ${priority}, ${description}`)
    try {
      const task = await Task.create({
        title : title,
        creator_id: 1,
        assignee_id : assigneeId,
        group_id : groupId,
        due_date : dueDate,
        priority,
        description,
        status: 'Pending',
      });

      // const userTask = await UserTask.create({
      //   user_id : 
      // });
  
      res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.get('/group-view/:id/members', async (req, res) => {
    try {
      const { id } = req.params;
        const group = await Group.findByPk(id, {
          include: [{
            model: User,
            through: UserGroup,
            attributes: ['user_id', 'name'],
          }],
        });
    
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
    
        res.json({ members: group.Users });
      } catch (error) {
        console.error('Error fetching group members:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
  });
  
  // Get task details
  router.get('/group-view/:groupId/tasks', verifyToken, async (req, res) => {
    const groupId = req.params.groupId;
  
    try {
      const tasks = await Task.findAll({ where: { group_id: groupId } });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

export default router;
