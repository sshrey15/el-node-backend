import prisma from '../utils/prisma.js';

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        user: true,
        inventoryItems: {
          include: {
            destination: true,
          },
        },
      },
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      uniqueCode,
      description,
      image,
      categoryId,
      userId,
      inventoryItems, // Expect an array of inventory items
    } = req.body;

    // Basic validation
    if (!inventoryItems || !Array.isArray(inventoryItems) || inventoryItems.length === 0) {
      return res.status(400).json({ error: 'Product must have at least one inventory item.' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        uniqueCode,
        description,
        image,
        categoryId,
        userId,
  
      },
      include: {
        inventoryItems: true,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, uniqueCode, description, image, categoryId } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, uniqueCode, description, image, categoryId },
    });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
