const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.post('/add', async (req, res) => {
  const { title, duration, description, channelId, typeId, categoryId, videoUrl, status } = req.body;

  try {
    // Check if IDs are valid integers
    const parsedChannelId = parseInt(channelId);
    const parsedTypeId = parseInt(typeId);
    const parsedCategoryId = parseInt(categoryId);
    const parsedDuration = parseInt(duration);

    if (isNaN(parsedChannelId) || isNaN(parsedTypeId) || isNaN(parsedCategoryId)) {
      return res.status(400).json({ error: 'Invalid channelId, typeId, or categoryId' });
    }

    // Create movie
    const movie = await prisma.movie.create({
      data: {
        title,
        duration: parsedDuration,
        description,
        channelId: parsedChannelId,
        typeId: parsedTypeId,
        categoryId: parsedCategoryId,
        videoUrl,
        status
      }
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const parsedCategoryId = parseInt(categoryId);

  console.log(`Received categoryId: ${categoryId}, parsed as: ${parsedCategoryId}`);

  if (isNaN(parsedCategoryId)) {
    return res.status(400).json({ error: 'Invalid categoryId' });
  }

  try {
    const movies = await prisma.movie.findMany({
      where: {
        categoryId: parsedCategoryId
      },
      include: {
        channel: true,
        type: true,
        category: true
      }
    });

    if (movies.length === 0) {
      console.log(`No movies found for categoryId: ${parsedCategoryId}`);
    } else {
      console.log(`Movies found: ${movies.length}`);
    }

    res.json(movies);
  } catch (error) {
    console.error(`Error fetching movies for categoryId: ${parsedCategoryId}`, error);
    res.status(500).json({ error: error.message });
  }
});

const PAGE_SIZE = 10; // Define the number of items per page

router.get("/getMovies",async(req,res)=>{
  try {
    const movie=await prisma.movie.findMany()
    res.status(200).send(movie)
  } catch (error) {
    
  }
})


router.get('/movies', async (req, res) => {
  const { network, category, page } = req.query;

  const parsedCategory = parseInt(category);
  const parsedPage = parseInt(page);
  if (isNaN(parsedCategory) || isNaN(parsedPage)) {
    return res.status(400).json({ error: 'Invalid category or page' });
  }
  try {
    // You can customize the logic here based on your data model and filtering requirements
    const movies = await prisma.movie.findMany({
      where: {
        categoryId: parsedCategory, // Filter by category
        // Add additional filters for network if necessary
      },
      skip: (parsedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Error fetching movies' });
  }
});

router.get("/movie/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: parseInt(id) }
    });
    res.status(200).send(movie);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, duration, description, channelId, typeId, categoryId, videoUrl, status } = req.body;
  try {
    const updatedProgram = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        title,
        duration:parseInt(channelId),
        description,
        channelId: parseInt(channelId),
        typeId: parseInt(typeId),
        categoryId: parseInt(categoryId),
        videoUrl,
        status
      }
    });
    res.status(200).json(updatedProgram);
  } catch (error) {
    console.error("Error updating program:", error);
    res.status(500).json({ error: "Error updating program" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.movie.delete({
      where: { id: parseInt(id) }
    });
    res.status(200).send("Channel has been deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get('/category-stats', async (req, res) => {
  try {
    const categoryStats = await prisma.category.findMany({
      select: {
        name: true,
        _count: {
          select: {
            movies: true,
          },
        },
      },
    });
    res.json(categoryStats);
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/types-stats', async (req, res) => {
  try {
    const typeStats = await prisma.type.findMany({
      select: {
        name: true,
        _count: {
          select: {
            movies: true,
          },
        },
      },
    });
    res.json(typeStats);
  } catch (error) {
    console.error('Error fetching types statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.get('/getMovies', async (req, res) => {
  const { category, page, sortBy, sortOrder, search } = req.query;
  const parsedCategory = parseInt(category);
  const parsedPage = parseInt(page) || 1;
  let whereCondition = {}; // Condition for filtering

  if (!isNaN(parsedCategory)) {
    whereCondition.categoryId = parsedCategory;
  }

  if (search) {
    whereCondition.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    // Build options for pagination and sorting
    const options = {
      where: whereCondition,
      skip: (parsedPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      orderBy: sortBy ? { [sortBy]: sortOrder === 'desc' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc } : undefined,
    };

    // Retrieve movies based on options
    const movies = await prisma.movie.findMany(options);

    res.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Error fetching movies' });
  }
});



module.exports = router;
