import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import { User, Group, UserGroup, Task, UserTask } from './models/associations.js'
import sequelize from './models/sequelize.js'

import groupRoutes from './routes/group.js';


const PORT = process.env.PORT || 5000;
const app = express();
app.use('/group', groupRoutes);

// Middleware
// app.use(cors());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(cookieParser()); // Use cookie-parser middleware

// JWT secret and expiration settings
const jwtSecret = '9a3e78bde3b7c3a6a9b3a7d9f3c8b7d6e3a6a9b3c7d9e3f6a9b3c7d9e3b6a9d'; // Replace with a securely generated secret key
const jwtExpiration = '1h'; // Token expiration set to 1 hour (3600 seconds)

async function syncModels() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    
    await sequelize.sync({ force: true }); 
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}


// syncModels();

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Retrieve token from cookies
  
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; // Add the decoded user information to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(400).json({ message: 'Invalid token.' });
    }
  };


async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

app.post('/signup', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      name: username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.user_id }, jwtSecret, {
      expiresIn: jwtExpiration,
    });
    console.log('in the login backend');
    res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/logout', (req, res) => {
  console.log('in the logout backend');
  // console.log(`token ${req.data.token}`)
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

app.get('/checkAuth', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'User is authenticated' });
});

app.get('/find-users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error finding users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
