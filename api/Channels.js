const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/add', async (req, res) => {
  const { name, status } = req.body;

  try {
    const channel = await prisma.channel.create({
      data: { name, status }
    });
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.get('/',async(req,res)=>{
  try {
    const channels=await prisma.channel.findMany()
    res.status(200).send(channels)
  } catch (error) {
    
  }
})

router.get('/getChannel', async (req, res) => {
  const { search, sort, page, limit } = req.query;

  const pageInt = parseInt(page) || 1;
  const limitInt =3
  const skip = (pageInt - 1) * limitInt;

  const orderBy = sort ? { [sort.replace('-', '')]: sort.startsWith('-') ? 'desc' : 'asc' } : {};

  try {
    const channels = await prisma.channel.findMany({
      where: {
        name: {
          contains: search || '',
          mode: 'insensitive',
        },
      },
      orderBy: orderBy,
      skip: skip,
      take: limitInt,
    });
    const total = await prisma.channel.count({
      where: {
        name: {
          contains: search || '',
          mode: 'insensitive',
        },
      },
    });

    res.json({ channels, total, page: pageInt, limit: limitInt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/channel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const channel = await prisma.channel.findUnique({
      where: { id: parseInt(id) }
    });
    res.status(200).send(channel);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    const channel = await prisma.channel.update({
      where: { id: parseInt(id) },
      data: { name, status }
    });
    res.status(200).send(channel);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.channel.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).send("Channel has been deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
