import prisma from '../utils/prisma.js';

// @desc    Get all products
// @route   GET /api/products
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

// @desc    Create a new product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      uniqueCode,
      description,
      image,
      categoryId,
      userId,
    } = req.body;

    // Basic validation to ensure required fields are present
    if (!name || !uniqueCode || !categoryId || !userId) {
        return res.status(400).json({ error: 'Missing required fields: name, uniqueCode, categoryId, userId' });
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
    });

    res.status(201).json(product);
  } catch (err) {
    // Handle potential errors, like a non-unique 'uniqueCode'
    res.status(400).json({ error: err.message });
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
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

// @desc    Delete a product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Note: Deleting a product will fail if inventory items are associated with it.
    // You must delete or reassign the inventory items first.
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

