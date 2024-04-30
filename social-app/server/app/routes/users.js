const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { name, image, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const newUser = new User({ name, image, username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while registering' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d',
        });

        res.json({ message: 'Login successful', accessToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/me', async (req, res) => {
    try {
        const accessToken = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { _id, name, image, username } = user;
        res.json({ _id, name, image, username });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/find/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const { _id, name, image } = user;
        res.json({ _id, username, name, image });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while finding the user' });
    }
});

router.get('/find-people/:searchTerm', async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm;
        const regex = new RegExp(searchTerm, 'i');
        
        const users = await User.find({ $or: [{ username: regex }, { name: regex }] });

        const usersList = users.map((user) => ({ _id: user._id, username: user.username, name: user.name, image: user.image }));
        res.json(usersList);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while finding users' });
    }
});

module.exports = router;