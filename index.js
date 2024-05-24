const { PrismaClient } = require('@prisma/client');
const express = require('express');
const app = express();
const cors = require('cors');
const prisma = new PrismaClient();
const authRoutes = require('./api/auth'); 
const movieRoutes = require('./api/Movies'); 
const channelsRouter = require('./api/Channels');
const typesRouter = require('./api/Types');
const categoriesRouter = require('./api/Categories');
const countRouter = require('./api/Count.js');

app.use(express.json());
app.use(cors());
app.use('/auth', authRoutes);
app.use('/movies', movieRoutes);
app.use('/channels', channelsRouter);
app.use('/types', typesRouter);
app.use('/categories', categoriesRouter);
app.use('/count', countRouter);



app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: { name, email }
  });
  res.json(user);
});

const PORT = 5432;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
