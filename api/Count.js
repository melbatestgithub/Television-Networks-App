// backend/routes/data.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// API endpoint to fetch counts
router.get('/counts', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const programCount = await prisma.movie.count();
    const channelCount = await prisma.channel.count();
    const totalCount = userCount + programCount + channelCount;
    
    res.json({ userCount, programCount, channelCount, totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}); 

module.exports = router;
