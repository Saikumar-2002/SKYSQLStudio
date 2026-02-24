const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const DEMO_MODE = process.env.DEMO_MODE === 'true';

// Demo user for demo mode
const DEMO_USER = {
    _id: 'demo_user_001',
    username: 'demo_student',
    email: 'demo@SKYSQLStudio.com',
    createdAt: new Date().toISOString()
};

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        if (DEMO_MODE) {
            const token = jwt.sign(
                { id: DEMO_USER._id, username: DEMO_USER.username },
                process.env.JWT_SECRET || 'demo_secret',
                { expiresIn: '7d' }
            );
            return res.status(201).json({ token, user: DEMO_USER });
        }

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ error: 'Username or email already exists.' });
        }

        const user = new User({ username, email, passwordHash: password });
        await user.save();

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ token, user: user.toJSON() });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        if (DEMO_MODE) {
            const token = jwt.sign(
                { id: DEMO_USER._id, username: DEMO_USER.username },
                process.env.JWT_SECRET || 'demo_secret',
                { expiresIn: '7d' }
            );
            return res.json({ token, user: DEMO_USER });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, user: user.toJSON() });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'No token' });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo_secret');

        if (DEMO_MODE) {
            return res.json({ user: DEMO_USER });
        }

        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ user: user.toJSON() });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
