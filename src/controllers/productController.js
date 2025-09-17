import prisma from '../utils/prisma.js';

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, destination: true, user: true }
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, uniqueCode, categoryId, destinationId, yearOfPurchase, description, status, userId } = req.body;
    const product = await prisma.product.create({
      data: { name, uniqueCode, categoryId, destinationId, yearOfPurchase, description, status, userId }
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await prisma.product.update({
      where: { id },
      data
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
