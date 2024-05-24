const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/add', async (req, res) => {
  const { name } = req.body;
  try {
    const category = await prisma.category.create({
      data: { name }
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get("/",async(req,res)=>{
  try {
    const category=await prisma.category.findMany()
    res.status(200).send(category)
  } catch (error) {
    res.status(500).send(error)
    
  }
})

module.exports = router;
