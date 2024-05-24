const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
    
const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register a new user
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name
      }
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Protected route example
router.get('/profile', authenticateToken, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });

  if (!user) {
    return res.sendStatus(404);
  }

  res.json({ user });
});


router.post('/favorites/add', authenticateToken, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.userId; // Access userId directly from req.user

  try {
    // Check if the movie is already in the user's favorites
    const existingEntry = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
        favorites: {
          some: { id: parseInt(movieId) }
        }
      }
    });

    if (existingEntry) {
      return res.status(400).json({ error: 'Movie already in favorites' });
    }

    // Add the movie to the user's favorites
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(userId)
      },
      data: {
        favorites: {
          connect: { id: parseInt(movieId) }
        }
      }
    });

    res.status(201).json(updatedUser);
  } catch (error) {
    console.error('Error adding movie to favorites:', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/favorites/remove/:movieId', authenticateToken, async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.userId; // Access userId directly from req.user

  try {
    // Check if the movie is in the user's favorites
    const existingEntry = await prisma.user.findFirst({
      where: {
        id: parseInt(userId),
        favorites: {
          some: { id: parseInt(movieId) }
        }
      }
    });

    if (!existingEntry) {
      return res.status(400).json({ error: 'Movie not found in favorites' });
    }

    // Remove the movie from the user's favorites
    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(userId)
      },
      data: {
        favorites: {
          disconnect: { id: parseInt(movieId) }
        }
      }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error removing movie from favorites:', error);
    res.status(500).json({ error: error.message });
  }
});




router.post('/watch-later/add', authenticateToken, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.userId; // Access userId directly from req.user

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the movie exists
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(movieId) }
    });
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    // Add the movie to the user's Watch Later list
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { watchLater: { connect: { id: parseInt(movieId) } } }
    });

    res.status(201).json({ message: 'Movie added to Watch Later list.', user: updatedUser });
  } catch (error) {
    console.error('Error adding movie to Watch Later list:', error);
    res.status(500).json({ error: error.message });
  }
});
;


module.exports = router;
