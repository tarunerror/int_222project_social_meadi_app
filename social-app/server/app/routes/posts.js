const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/create', async (req, res) => {
  try {
    const { description, isStory, image, tags, location, vibetags, likes } = req.body;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;
    if (!description || !image) {
      return res.status(400).json({ error: 'Please enter all required fields' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const post = new Post({
      creator: {
        _id: user._id,
        username: user.username,
        name: user.name,
        image: user.image,
      },
      description,
      isStory,
      image,
      tags,
      location,
      vibetags,
      likes,
    });

    await post.save();
    user.posts.push(post._id);
    await user.save();
    res.json({ message: 'Post or story created successfully', post });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while creating the post or story' });
  }
});

router.post('/like/:postId', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post or story not found' });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id != userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: 'Post or story liked successfully', post });
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while liking the post or story' });
  }
});

router.get('/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post or story not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the post or story' });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while fetching the posts' });
  }
});

module.exports = router;