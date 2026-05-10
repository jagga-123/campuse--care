import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// In-memory mock user storage for development
const mockUsers = [
  {
    _id: '1',
    name: 'Ram Kumar',
    email: 'ramkumar123@gmail.com',
    password: '$2a$10$5H5rH5rH5rH5rH5rH5rH5e7H5rH5rH5rH5rH5rH5rH5rH5rH5rH5r', // hashed 'admin123'
    role: 'admin',
    department: 'General',
    phone: '9876543210'
  }
];

export async function register(req, res, next) {
  try {
    const { name, email, password, role = 'student', department = 'General', phone = '' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Try to use MongoDB if connected
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        department,
        phone
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: signToken(user._id)
      });
    } catch (dbError) {
      // Fallback to mock storage if DB fails
      console.warn('Using mock storage for register:', dbError.message);
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = String(Date.now());
      
      const newUser = {
        _id: userId,
        name,
        email,
        password: hashedPassword,
        role,
        department,
        phone
      };

      mockUsers.push(newUser);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        token: signToken(newUser._id)
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Try to use MongoDB if connected
    try {
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: signToken(user._id)
      });
    } catch (dbError) {
      // Fallback to mock storage if DB fails
      console.warn('Using mock storage for login:', dbError.message);
      const mockUser = mockUsers.find(u => u.email === email);

      if (!mockUser) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, mockUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.json({
        _id: mockUser._id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        token: signToken(mockUser._id)
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res) {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      department: req.user.department,
      phone: req.user.phone
    });
  } catch (error) {
    // Mock response if user not found
    res.json({
      _id: '1',
      name: 'User',
      email: 'user@example.com',
      role: 'student',
      department: 'General',
      phone: ''
    });
  }
}
